import { createDatabase, insertRepos, insertStats, exportLeaderboard, exportWeeklyRanking, exportRepos } from "./db.js";
import { fetchQualifyingRepos } from "./github.js";
import { fetchRepoStats } from "./bigquery.js";

function validateWeek(w: string): void {
  if (!/^\d{4}-W\d{2}$/.test(w)) {
    throw new Error(`Invalid week format: ${w}. Expected YYYY-Wnn (e.g. 2026-W08)`);
  }
}

function parseWeek(w: string): { year: number; week: number } {
  const match = w.match(/^(\d{4})-W(\d{2})$/)!;
  return { year: parseInt(match[1]), week: parseInt(match[2]) };
}

function formatWeek(year: number, week: number): string {
  return `${year}-W${String(week).padStart(2, "0")}`;
}

/** Return the number of ISO weeks in a given year (52 or 53). */
function isoWeeksInYear(year: number): number {
  // A year has 53 ISO weeks if Jan 1 is Thursday, or Dec 31 is Thursday.
  const jan1 = new Date(Date.UTC(year, 0, 1)).getUTCDay();
  const dec31 = new Date(Date.UTC(year, 11, 31)).getUTCDay();
  return jan1 === 4 || dec31 === 4 ? 53 : 52;
}

/** Expand a start..end range into an array of week strings. */
function expandWeekRange(start: string, end: string): string[] {
  const s = parseWeek(start);
  const e = parseWeek(end);
  const weeks: string[] = [];

  let year = s.year;
  let week = s.week;
  while (year < e.year || (year === e.year && week <= e.week)) {
    weeks.push(formatWeek(year, week));
    week++;
    if (week > isoWeeksInYear(year)) {
      year++;
      week = 1;
    }
  }
  return weeks;
}

function getLatestCompleteWeek(): string {
  const now = new Date();
  const dayOfWeek = now.getUTCDay() || 7; // Sunday=0 → 7
  // Go back to Monday of the current week, then one more week
  const lastMonday = new Date(now);
  lastMonday.setUTCDate(now.getUTCDate() - dayOfWeek - 6);

  // Compute ISO week number for that Monday
  const d = new Date(Date.UTC(lastMonday.getUTCFullYear(), lastMonday.getUTCMonth(), lastMonday.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function getTargetWeeks(args: string[]): string[] {
  if (args.length === 0) {
    return [getLatestCompleteWeek()];
  }
  if (args.length === 1) {
    validateWeek(args[0]);
    return [args[0]];
  }
  if (args.length === 2) {
    validateWeek(args[0]);
    validateWeek(args[1]);
    const weeks = expandWeekRange(args[0], args[1]);
    if (weeks.length === 0) {
      throw new Error(`Empty range: ${args[0]} is after ${args[1]}`);
    }
    return weeks;
  }
  throw new Error("Usage: fetch [YYYY-Wnn] or fetch YYYY-Wnn YYYY-Wnn");
}

async function main() {
  const targetWeeks = getTargetWeeks(process.argv.slice(2));
  console.log(`\nTarget weeks: ${targetWeeks[0]} .. ${targetWeeks[targetWeeks.length - 1]} (${targetWeeks.length} week${targetWeeks.length > 1 ? "s" : ""})\n`);

  // Pass 1: Find qualifying repos via GitHub API
  const qualifyingRepos = await fetchQualifyingRepos();
  if (qualifyingRepos.length === 0) {
    console.log("No qualifying repos found. Exiting.");
    process.exit(0);
  }

  // Pass 2: Fetch weekly stats for each target week
  const repoNames = qualifyingRepos.map((r) => r.name);
  const allStats = [];
  for (const week of targetWeeks) {
    console.log(`\n--- Fetching ${week} ---`);
    const stats = await fetchRepoStats(week, repoNames);
    allStats.push(...stats);
  }

  // Write to SQLite
  console.log("\nWriting to SQLite...");
  const db = createDatabase();
  insertRepos(db, qualifyingRepos);
  insertStats(db, allStats);
  exportLeaderboard(db);
  exportWeeklyRanking(db);
  exportRepos(db);
  db.close();

  console.log(`\nDone! ${qualifyingRepos.length} repos, ${allStats.length} stat rows written to data.db`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
