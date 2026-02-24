import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import type { QualifyingRepo, RepoStats } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "data.db");

export function createDatabase(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  db.exec(`
    DROP TABLE IF EXISTS monthly_stats;
    DROP TABLE IF EXISTS repos;

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

    CREATE TABLE monthly_stats (
      repo_name TEXT NOT NULL,
      month TEXT NOT NULL,
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
      PRIMARY KEY (repo_name, month),
      FOREIGN KEY (repo_name) REFERENCES repos(name)
    );

    CREATE INDEX idx_repos_owner ON repos(owner);
    CREATE INDEX idx_repos_stars ON repos(stars_total DESC);
    CREATE INDEX idx_repos_language ON repos(language);
    CREATE INDEX idx_stats_month ON monthly_stats(month, new_stars DESC);
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

export function insertStats(db: Database.Database, stats: RepoStats[]): void {
  const stmt = db.prepare(`
    INSERT INTO monthly_stats (
      repo_name, month, new_stars, new_forks,
      issues_opened, issues_closed, prs_opened, prs_merged,
      pushes, commits, releases, review_comments, unique_contributors
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertMany = db.transaction((items: RepoStats[]) => {
    for (const s of items) {
      stmt.run(
        s.repo_name, s.month, s.new_stars, s.new_forks,
        s.issues_opened, s.issues_closed, s.prs_opened, s.prs_merged,
        s.pushes, s.commits, s.releases, s.review_comments, s.unique_contributors
      );
    }
  });
  insertMany(stats);
}
