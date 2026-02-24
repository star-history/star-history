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
      stars_total INTEGER NOT NULL
    );

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
  `);

  return db;
}

export function insertRepos(db: Database.Database, repos: QualifyingRepo[]): void {
  const stmt = db.prepare("INSERT INTO repos (name, stars_total) VALUES (?, ?)");
  const insertMany = db.transaction((items: QualifyingRepo[]) => {
    for (const repo of items) {
      stmt.run(repo.name, repo.star_count);
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
