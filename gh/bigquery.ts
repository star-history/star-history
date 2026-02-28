import { BigQuery } from "@google-cloud/bigquery";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { RepoStats } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadCredentials(): Record<string, string> {
  if (process.env.GCP_SERVICE_ACCOUNT_BIGQUERY) {
    return JSON.parse(process.env.GCP_SERVICE_ACCOUNT_BIGQUERY);
  }

  const keyPath = path.join(__dirname, "gcp-service-account.json");
  try {
    return JSON.parse(readFileSync(keyPath, "utf-8"));
  } catch {
    throw new Error(
      "GCP credentials not found. Set GCP_SERVICE_ACCOUNT_BIGQUERY env var or place gh/gcp-service-account.json"
    );
  }
}

/**
 * Convert an ISO week string (YYYY-Wnn) to an array of 7 YYYYMMDD strings
 * (Monday through Sunday) for BigQuery daily table names.
 */
export function weekToDays(week: string): string[] {
  const match = week.match(/^(\d{4})-W(\d{2})$/);
  if (!match) throw new Error(`Invalid week format: ${week}. Expected YYYY-Wnn`);

  const year = parseInt(match[1]);
  const weekNum = parseInt(match[2]);
  if (weekNum < 1 || weekNum > 53) throw new Error(`Invalid week number: ${weekNum}`);

  // ISO 8601: Week 1 contains January 4th.
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7; // Sunday=0 → 7
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1);

  // Monday of target week
  const targetMonday = new Date(week1Monday);
  targetMonday.setUTCDate(week1Monday.getUTCDate() + (weekNum - 1) * 7);

  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;

  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(targetMonday);
    d.setUTCDate(targetMonday.getUTCDate() + i);
    days.push(fmt(d));
  }
  return days;
}

export async function fetchRepoStats(
  week: string,
  repoNames: string[]
): Promise<RepoStats[]> {
  const credentials = loadCredentials();
  const client = new BigQuery({
    credentials,
    projectId: credentials.project_id,
  });

  const days = weekToDays(week);

  // Union individual day tables to avoid the wildcard view issue
  const unionAll = days
    .map((d) => `SELECT * FROM \`githubarchive.day.${d}\``)
    .join(" UNION ALL\n    ");

  const query = `
    SELECT
      repo.name as repo_name,
      COUNTIF(type = 'WatchEvent') as new_stars,
      COUNTIF(type = 'ForkEvent') as new_forks,
      COUNTIF(type = 'IssuesEvent' AND JSON_VALUE(payload, '$.action') = 'opened') as issues_opened,
      COUNTIF(type = 'IssuesEvent' AND JSON_VALUE(payload, '$.action') = 'closed') as issues_closed,
      COUNTIF(type = 'PullRequestEvent' AND JSON_VALUE(payload, '$.action') = 'opened') as prs_opened,
      COUNTIF(type = 'PullRequestEvent' AND JSON_VALUE(payload, '$.action') = 'closed'
        AND JSON_VALUE(payload, '$.pull_request.merged') = 'true') as prs_merged,
      COUNTIF(type = 'PushEvent') as pushes,
      SUM(IF(type = 'PushEvent', CAST(JSON_VALUE(payload, '$.size') AS INT64), 0)) as commits,
      COUNTIF(type = 'ReleaseEvent') as releases,
      COUNTIF(type = 'PullRequestReviewCommentEvent') as review_comments,
      COUNT(DISTINCT actor.login) as unique_contributors
    FROM (${unionAll})
    WHERE repo.name IN UNNEST(@repos)
    GROUP BY repo.name
  `;

  const BATCH_SIZE = 5000;
  const allStats: RepoStats[] = [];

  for (let i = 0; i < repoNames.length; i += BATCH_SIZE) {
    const batch = repoNames.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(repoNames.length / BATCH_SIZE);
    console.log(`[Pass 2] Fetching stats batch ${batchNum}/${totalBatches} (${batch.length} repos, ${days[0]}..${days[6]})...`);

    try {
      const [rows] = await client.query({
        query,
        params: { repos: batch },
      });

      for (const row of rows) {
        allStats.push({
          repo_name: row.repo_name,
          week,
          new_stars: Number(row.new_stars),
          new_forks: Number(row.new_forks),
          issues_opened: Number(row.issues_opened),
          issues_closed: Number(row.issues_closed),
          prs_opened: Number(row.prs_opened),
          prs_merged: Number(row.prs_merged),
          pushes: Number(row.pushes),
          commits: Number(row.commits),
          releases: Number(row.releases),
          review_comments: Number(row.review_comments),
          unique_contributors: Number(row.unique_contributors),
        });
      }
    } catch (err: any) {
      // Skip weeks where day tables don't exist (e.g. future dates)
      if (err?.code === 404 || err?.message?.includes("Not found")) {
        console.warn(`[Pass 2] Skipping ${week} batch ${batchNum}: table not found`);
      } else {
        throw err;
      }
    }
  }

  console.log(`[Pass 2] Fetched stats for ${allStats.length} repos`);
  return allStats;
}
