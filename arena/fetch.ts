import { createDatabase, insertRepos, insertStats } from "./db.js";
import { fetchQualifyingRepos } from "./github.js";
import { fetchRepoStats } from "./bigquery.js";

function getTargetMonth(arg?: string): string {
  if (arg) {
    // Validate YYYY-MM format
    if (!/^\d{4}-\d{2}$/.test(arg)) {
      throw new Error(`Invalid month format: ${arg}. Expected YYYY-MM`);
    }
    return arg;
  }

  // Default to latest complete month
  const now = new Date();
  const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const month = now.getMonth() === 0 ? 12 : now.getMonth();
  return `${year}-${String(month).padStart(2, "0")}`;
}

async function main() {
  const targetMonth = getTargetMonth(process.argv[2]);
  console.log(`\nTarget month: ${targetMonth}\n`);

  // Pass 1: Find qualifying repos via GitHub API
  const qualifyingRepos = await fetchQualifyingRepos();
  if (qualifyingRepos.length === 0) {
    console.log("No qualifying repos found. Exiting.");
    process.exit(0);
  }

  // Pass 2: Fetch stats for qualifying repos
  const repoNames = qualifyingRepos.map((r) => r.name);
  const stats = await fetchRepoStats(targetMonth, repoNames);

  // Write to SQLite
  console.log("\nWriting to SQLite...");
  const db = createDatabase();
  insertRepos(db, qualifyingRepos);
  insertStats(db, stats);
  db.close();

  console.log(`\nDone! ${qualifyingRepos.length} repos, ${stats.length} stat rows written to data.db`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
