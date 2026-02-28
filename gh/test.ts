import { describe, it } from "node:test";
import assert from "node:assert";
import Database from "better-sqlite3";
import { weekToDays } from "./bigquery.js";

function createTestDb(): Database.Database {
  const db = new Database(":memory:");
  db.exec(`
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
  `);
  return db;
}

const INSERT_REPO = `
  INSERT INTO repos (
    name, owner, stars_total, description, language, topics, license,
    homepage, created_at, updated_at, pushed_at,
    forks_count, open_issues_count, size, archived, owner_type
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

describe("SQLite schema", () => {
  it("inserts and queries repos with metadata", () => {
    const db = createTestDb();
    db.prepare(INSERT_REPO).run(
      "owner/repo", "owner", 500, "A cool project", "TypeScript",
      '["cli","tool"]', "MIT", "https://example.com",
      "2020-01-01T00:00:00Z", "2026-01-15T00:00:00Z", "2026-01-14T00:00:00Z",
      120, 45, 5000, 0, "Organization"
    );

    const row = db.prepare("SELECT * FROM repos WHERE name = ?").get("owner/repo") as any;
    assert.strictEqual(row.name, "owner/repo");
    assert.strictEqual(row.owner, "owner");
    assert.strictEqual(row.stars_total, 500);
    assert.strictEqual(row.description, "A cool project");
    assert.strictEqual(row.language, "TypeScript");
    assert.deepStrictEqual(JSON.parse(row.topics), ["cli", "tool"]);
    assert.strictEqual(row.license, "MIT");
    assert.strictEqual(row.homepage, "https://example.com");
    assert.strictEqual(row.forks_count, 120);
    assert.strictEqual(row.open_issues_count, 45);
    assert.strictEqual(row.size, 5000);
    assert.strictEqual(row.archived, 0);
    assert.strictEqual(row.owner_type, "Organization");
    db.close();
  });

  it("inserts and queries weekly_stats", () => {
    const db = createTestDb();
    db.prepare(INSERT_REPO).run(
      "owner/repo", "owner", 500, null, null, "[]", null, null,
      "2020-01-01T00:00:00Z", "2026-01-15T00:00:00Z", "2026-01-14T00:00:00Z",
      0, 0, 0, 0, "User"
    );
    db.prepare(`
      INSERT INTO weekly_stats (
        repo_name, week, new_stars, new_forks,
        issues_opened, issues_closed, prs_opened, prs_merged,
        pushes, commits, releases, review_comments, unique_contributors
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run("owner/repo", "2026-W03", 150, 30, 45, 20, 35, 25, 200, 500, 3, 80, 42);

    const row = db.prepare("SELECT * FROM weekly_stats WHERE repo_name = ?").get("owner/repo") as any;
    assert.strictEqual(row.new_stars, 150);
    assert.strictEqual(row.unique_contributors, 42);
    assert.strictEqual(row.week, "2026-W03");
    db.close();
  });

  it("enforces primary key on repos", () => {
    const db = createTestDb();
    db.prepare(INSERT_REPO).run(
      "owner/repo", "owner", 500, null, null, "[]", null, null,
      "2020-01-01T00:00:00Z", "2026-01-15T00:00:00Z", "2026-01-14T00:00:00Z",
      0, 0, 0, 0, "User"
    );
    assert.throws(() =>
      db.prepare(INSERT_REPO).run(
        "owner/repo", "owner", 600, null, null, "[]", null, null,
        "2020-01-01T00:00:00Z", "2026-01-15T00:00:00Z", "2026-01-14T00:00:00Z",
        0, 0, 0, 0, "User"
      )
    );
    db.close();
  });

  it("supports PvP comparison query", () => {
    const db = createTestDb();
    db.prepare(INSERT_REPO).run(
      "org/alpha", "org", 1000, "Alpha project", "Go", '["api"]', "Apache-2.0", null,
      "2019-01-01T00:00:00Z", "2026-01-15T00:00:00Z", "2026-01-14T00:00:00Z",
      200, 50, 10000, 0, "Organization"
    );
    db.prepare(INSERT_REPO).run(
      "org/beta", "org", 800, "Beta project", "Rust", '["cli"]', "MIT", null,
      "2020-06-01T00:00:00Z", "2026-01-10T00:00:00Z", "2026-01-09T00:00:00Z",
      150, 30, 8000, 0, "Organization"
    );
    db.prepare(`
      INSERT INTO weekly_stats VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run("org/alpha", "2026-W03", 200, 50, 60, 40, 30, 20, 100, 300, 5, 40, 80);
    db.prepare(`
      INSERT INTO weekly_stats VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run("org/beta", "2026-W03", 150, 70, 80, 60, 50, 40, 150, 400, 8, 60, 100);

    const rows = db.prepare(`
      SELECT r.name, r.stars_total, r.language, r.license, s.*
      FROM repos r
      JOIN weekly_stats s ON r.name = s.repo_name
      WHERE r.name IN ('org/alpha', 'org/beta')
      AND s.week = '2026-W03'
      ORDER BY s.new_stars DESC
    `).all() as any[];

    assert.strictEqual(rows.length, 2);
    assert.strictEqual(rows[0].name, "org/alpha");
    assert.strictEqual(rows[0].language, "Go");
    assert.strictEqual(rows[1].name, "org/beta");
    assert.strictEqual(rows[1].license, "MIT");
    db.close();
  });

  it("aggregates by owner via owners view", () => {
    const db = createTestDb();
    db.prepare(INSERT_REPO).run(
      "acme/foo", "acme", 5000, null, null, "[]", null, null,
      "2020-01-01T00:00:00Z", "2026-01-15T00:00:00Z", "2026-01-14T00:00:00Z",
      100, 20, 3000, 0, "Organization"
    );
    db.prepare(INSERT_REPO).run(
      "acme/bar", "acme", 3000, null, null, "[]", null, null,
      "2021-01-01T00:00:00Z", "2026-01-10T00:00:00Z", "2026-01-09T00:00:00Z",
      50, 10, 2000, 0, "Organization"
    );

    const row = db.prepare("SELECT * FROM owners WHERE owner = ?").get("acme") as any;
    assert.strictEqual(row.owner, "acme");
    assert.strictEqual(row.repo_count, 2);
    assert.strictEqual(row.stars_total, 8000);
    assert.strictEqual(row.forks_total, 150);
    assert.strictEqual(row.size_total, 5000);
    db.close();
  });
});

describe("weekToDays", () => {
  it("computes correct 7 days for 2026-W01", () => {
    // Jan 1, 2026 is Thursday. ISO W01 Monday = Dec 29, 2025.
    const days = weekToDays("2026-W01");
    assert.strictEqual(days.length, 7);
    assert.strictEqual(days[0], "20251229"); // Monday
    assert.strictEqual(days[6], "20260104"); // Sunday
  });

  it("computes correct 7 days for 2026-W08", () => {
    // Week 8 of 2026: Monday Feb 16 – Sunday Feb 22
    const days = weekToDays("2026-W08");
    assert.strictEqual(days.length, 7);
    assert.strictEqual(days[0], "20260216");
    assert.strictEqual(days[6], "20260222");
  });

  it("rejects invalid format", () => {
    assert.throws(() => weekToDays("2026-01"), /Invalid week format/);
    assert.throws(() => weekToDays("2026-W00"), /Invalid week number/);
    assert.throws(() => weekToDays("2026-W54"), /Invalid week number/);
  });
});
