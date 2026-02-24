import { describe, it } from "node:test";
import assert from "node:assert";
import Database from "better-sqlite3";

function createTestDb(): Database.Database {
  const db = new Database(":memory:");
  db.exec(`
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

describe("SQLite schema", () => {
  it("inserts and queries repos", () => {
    const db = createTestDb();
    const stmt = db.prepare("INSERT INTO repos (name, stars_total) VALUES (?, ?)");
    stmt.run("owner/repo", 500);

    const row = db.prepare("SELECT * FROM repos WHERE name = ?").get("owner/repo") as any;
    assert.strictEqual(row.name, "owner/repo");
    assert.strictEqual(row.stars_total, 500);
    db.close();
  });

  it("inserts and queries monthly_stats", () => {
    const db = createTestDb();
    db.prepare("INSERT INTO repos (name, stars_total) VALUES (?, ?)").run("owner/repo", 500);
    db.prepare(`
      INSERT INTO monthly_stats (
        repo_name, month, new_stars, new_forks,
        issues_opened, issues_closed, prs_opened, prs_merged,
        pushes, commits, releases, review_comments, unique_contributors
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run("owner/repo", "2026-01", 150, 30, 45, 20, 35, 25, 200, 500, 3, 80, 42);

    const row = db.prepare("SELECT * FROM monthly_stats WHERE repo_name = ?").get("owner/repo") as any;
    assert.strictEqual(row.new_stars, 150);
    assert.strictEqual(row.unique_contributors, 42);
    db.close();
  });

  it("enforces primary key on repos", () => {
    const db = createTestDb();
    const stmt = db.prepare("INSERT INTO repos (name, stars_total) VALUES (?, ?)");
    stmt.run("owner/repo", 500);
    assert.throws(() => stmt.run("owner/repo", 600));
    db.close();
  });

  it("supports PvP comparison query", () => {
    const db = createTestDb();
    db.prepare("INSERT INTO repos VALUES (?, ?)").run("org/alpha", 1000);
    db.prepare("INSERT INTO repos VALUES (?, ?)").run("org/beta", 800);
    db.prepare(`
      INSERT INTO monthly_stats VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run("org/alpha", "2026-01", 200, 50, 60, 40, 30, 20, 100, 300, 5, 40, 80);
    db.prepare(`
      INSERT INTO monthly_stats VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run("org/beta", "2026-01", 150, 70, 80, 60, 50, 40, 150, 400, 8, 60, 100);

    const rows = db.prepare(`
      SELECT r.name, r.stars_total, s.*
      FROM repos r
      JOIN monthly_stats s ON r.name = s.repo_name
      WHERE r.name IN ('org/alpha', 'org/beta')
      AND s.month = '2026-01'
      ORDER BY s.new_stars DESC
    `).all() as any[];

    assert.strictEqual(rows.length, 2);
    assert.strictEqual(rows[0].name, "org/alpha");
    assert.strictEqual(rows[1].name, "org/beta");
    db.close();
  });
});
