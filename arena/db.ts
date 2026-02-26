import Database from "better-sqlite3";
import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { QualifyingRepo, RepoStats } from "./types.js";
import { MIN_STARS } from "./github.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "data.db");

export function createDatabase(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  db.exec(`
    PRAGMA foreign_keys = OFF;
    DROP TABLE IF EXISTS weekly_stats;
    DROP VIEW IF EXISTS owners;
    DROP TABLE IF EXISTS repos;
    PRAGMA foreign_keys = ON;

    CREATE TABLE repos (
      name TEXT PRIMARY KEY,
      owner TEXT NOT NULL,
      stars_total INTEGER NOT NULL,
      description TEXT,
      language TEXT,
      topics TEXT,
      license TEXT,
      homepage TEXT,
      created_at TEXT,
      updated_at TEXT,
      pushed_at TEXT,
      forks_count INTEGER NOT NULL DEFAULT 0,
      open_issues_count INTEGER NOT NULL DEFAULT 0,
      size INTEGER NOT NULL DEFAULT 0,
      archived INTEGER NOT NULL DEFAULT 0,
      owner_type TEXT NOT NULL DEFAULT 'User'
    );

    CREATE VIEW owners AS
    SELECT
      owner,
      owner_type,
      COUNT(*) AS repo_count,
      SUM(stars_total) AS stars_total,
      SUM(forks_count) AS forks_total,
      SUM(open_issues_count) AS open_issues_total,
      SUM(size) AS size_total
    FROM repos
    GROUP BY owner, owner_type;

    CREATE TABLE weekly_stats (
      repo_name TEXT NOT NULL,
      week TEXT NOT NULL,
      new_stars INTEGER NOT NULL DEFAULT 0,
      new_forks INTEGER NOT NULL DEFAULT 0,
      issues_opened INTEGER NOT NULL DEFAULT 0,
      issues_closed INTEGER NOT NULL DEFAULT 0,
      prs_opened INTEGER NOT NULL DEFAULT 0,
      prs_merged INTEGER NOT NULL DEFAULT 0,
      pushes INTEGER NOT NULL DEFAULT 0,
      commits INTEGER NOT NULL DEFAULT 0,
      releases INTEGER NOT NULL DEFAULT 0,
      review_comments INTEGER NOT NULL DEFAULT 0,
      unique_contributors INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (repo_name, week),
      FOREIGN KEY (repo_name) REFERENCES repos(name)
    );

    CREATE INDEX idx_repos_owner ON repos(owner);
    CREATE INDEX idx_repos_stars ON repos(stars_total DESC);
    CREATE INDEX idx_repos_language ON repos(language);
    CREATE INDEX idx_stats_week ON weekly_stats(week, new_stars DESC);
  `);

  return db;
}

export function insertRepos(db: Database.Database, repos: QualifyingRepo[]): void {
  const stmt = db.prepare(`
    INSERT INTO repos (
      name, owner, stars_total, description, language, topics, license,
      homepage, created_at, updated_at, pushed_at,
      forks_count, open_issues_count, size, archived, owner_type
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMany = db.transaction((items: QualifyingRepo[]) => {
    for (const repo of items) {
      const owner = repo.name.split("/")[0];
      stmt.run(
        repo.name, owner, repo.star_count, repo.description, repo.language,
        JSON.stringify(repo.topics), repo.license,
        repo.homepage, repo.created_at, repo.updated_at, repo.pushed_at,
        repo.forks_count, repo.open_issues_count, repo.size,
        repo.archived ? 1 : 0, repo.owner_type
      );
    }
  });
  insertMany(repos);
}

export function exportLeaderboard(db: Database.Database, limit = 20): void {
  const rows = db.prepare(
    "SELECT name, stars_total FROM repos ORDER BY stars_total DESC LIMIT ?"
  ).all(limit) as { name: string; stars_total: number }[];

  const outPath = path.join(__dirname, "..", "frontend", "helpers", "leaderboard.json");
  writeFileSync(outPath, JSON.stringify(rows, null, 2) + "\n");
  console.log(`Exported top ${rows.length} repos to leaderboard.json`);
}

export function exportWeeklyRanking(db: Database.Database, limit = 20): void {
  const rows = db.prepare(`
    SELECT w.repo_name AS name, w.new_stars, r.stars_total
    FROM weekly_stats w
    JOIN repos r ON r.name = w.repo_name
    WHERE w.week = (SELECT MAX(week) FROM weekly_stats)
    ORDER BY w.new_stars DESC
    LIMIT ?
  `).all(limit) as { name: string; new_stars: number; stars_total: number }[];

  const outPath = path.join(__dirname, "..", "frontend", "helpers", "weekly-ranking.json");
  writeFileSync(outPath, JSON.stringify(rows, null, 2) + "\n");
  console.log(`Exported top ${rows.length} repos by weekly stars to weekly-ranking.json`);
}

export function exportRepos(db: Database.Database): void {
  const rows = db.prepare(
    `SELECT name, stars_total, description, language, topics, license,
            homepage, forks_count, open_issues_count, created_at, archived
     FROM repos ORDER BY stars_total DESC`
  ).all();
  const outPath = path.join(__dirname, "..", "frontend", "helpers", "repos.json");
  writeFileSync(outPath, JSON.stringify(rows, null, 2) + "\n");
  console.log(`Exported ${rows.length} repos to repos.json`);
}

export function exportRepoCards(db: Database.Database): void {
  // Aggregate weekly_stats over last 8 weeks per repo
  const rows = db.prepare(`
    WITH recent AS (
      SELECT week FROM weekly_stats GROUP BY week ORDER BY week DESC LIMIT 8
    ),
    agg AS (
      SELECT
        w.repo_name,
        SUM(w.new_stars) AS agg_new_stars,
        SUM(w.pushes) AS agg_pushes,
        SUM(w.unique_contributors) AS agg_contributors,
        SUM(w.issues_closed) AS agg_issues_closed
      FROM weekly_stats w
      WHERE w.week IN (SELECT week FROM recent)
      GROUP BY w.repo_name
    )
    SELECT
      r.name,
      r.owner,
      r.stars_total,
      r.description,
      r.language,
      r.topics,
      r.license,
      r.homepage,
      r.forks_count,
      r.open_issues_count,
      r.created_at,
      r.archived,
      r.size,
      COALESCE(a.agg_new_stars, 0) AS agg_new_stars,
      COALESCE(a.agg_pushes, 0) AS agg_pushes,
      COALESCE(a.agg_contributors, 0) AS agg_contributors,
      COALESCE(a.agg_issues_closed, 0) AS agg_issues_closed,
      ROW_NUMBER() OVER (ORDER BY r.stars_total DESC) AS rank
    FROM repos r
    LEFT JOIN agg a ON a.repo_name = r.name
    ORDER BY r.stars_total DESC
  `).all() as any[];

  const totalRepos = rows.length;

  // Compute raw values for percentile ranking
  const rawValues = {
    stars: rows.map((r) => r.stars_total as number),
    new_stars: rows.map((r) => r.agg_new_stars as number),
    pushes: rows.map((r) => r.agg_pushes as number),
    contributors: rows.map((r) => r.agg_contributors as number),
    issues_closed: rows.map((r) => r.agg_issues_closed as number),
    forks: rows.map((r) => r.forks_count as number),
  };

  // Percentile: fraction of values strictly less than this value, scaled to 0-99
  function percentile(sorted: number[], value: number): number {
    let count = 0;
    for (const v of sorted) {
      if (v < value) count++;
    }
    return Math.round((count / sorted.length) * 99);
  }

  const sorted = {
    stars: [...rawValues.stars].sort((a, b) => a - b),
    new_stars: [...rawValues.new_stars].sort((a, b) => a - b),
    pushes: [...rawValues.pushes].sort((a, b) => a - b),
    contributors: [...rawValues.contributors].sort((a, b) => a - b),
    issues_closed: [...rawValues.issues_closed].sort((a, b) => a - b),
    forks: [...rawValues.forks].sort((a, b) => a - b),
  };

  const cards = rows.map((r, i) => {
    let topics: string[] = [];
    try {
      topics = r.topics ? JSON.parse(r.topics) : [];
    } catch {
      topics = [];
    }

    return {
      name: r.name,
      owner: r.owner,
      stars_total: r.stars_total,
      description: r.description,
      language: r.language,
      topics,
      license: r.license,
      homepage: r.homepage,
      forks_count: r.forks_count,
      open_issues_count: r.open_issues_count,
      created_at: r.created_at,
      archived: r.archived === 1,
      size: r.size,
      rank: r.rank,
      total_repos: totalRepos,
      attributes: {
        stars: percentile(sorted.stars, rawValues.stars[i]),
        new_stars: percentile(sorted.new_stars, rawValues.new_stars[i]),
        pushes: percentile(sorted.pushes, rawValues.pushes[i]),
        contributors: percentile(sorted.contributors, rawValues.contributors[i]),
        issues_closed: percentile(sorted.issues_closed, rawValues.issues_closed[i]),
        forks: percentile(sorted.forks, rawValues.forks[i]),
      },
    };
  });

  const output = { min_stars: MIN_STARS, repos: cards };
  const outPath = path.join(__dirname, "..", "frontend", "helpers", "repo-cards.json");
  writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n");
  console.log(`Exported ${cards.length} repo cards to repo-cards.json`);
}

export function insertStats(db: Database.Database, stats: RepoStats[]): void {
  const stmt = db.prepare(`
    INSERT INTO weekly_stats (
      repo_name, week, new_stars, new_forks,
      issues_opened, issues_closed, prs_opened, prs_merged,
      pushes, commits, releases, review_comments, unique_contributors
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMany = db.transaction((items: RepoStats[]) => {
    for (const s of items) {
      stmt.run(
        s.repo_name, s.week, s.new_stars, s.new_forks,
        s.issues_opened, s.issues_closed, s.prs_opened, s.prs_merged,
        s.pushes, s.commits, s.releases, s.review_comments, s.unique_contributors
      );
    }
  });
  insertMany(stats);
}
