import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { QualifyingRepo } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN_PATH = path.join(__dirname, "github-token.env");

const tokens: string[] = [];
let tokenIndex = 0;

function loadTokens(): void {
  if (tokens.length > 0) return;

  // Prefer GITHUB_TOKENS env var (newline-separated, used in CI)
  const envTokens = process.env.GITHUB_TOKENS;
  const content = envTokens ?? readFileSync(TOKEN_PATH, "utf-8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      tokens.push(trimmed);
    }
  }

  if (tokens.length === 0) {
    throw new Error(
      "No GitHub tokens found. Set GITHUB_TOKENS env var or place gh/github-token.env"
    );
  }

  console.log(`[GitHub] Loaded ${tokens.length} token(s)`);
}

function getNextToken(): string {
  const token = tokens[tokenIndex];
  tokenIndex = (tokenIndex + 1) % tokens.length;
  return token;
}

async function githubFetch(url: string, retries = 0): Promise<any> {
  const token = getNextToken();
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (res.status === 403 || res.status === 429) {
    if (retries >= tokens.length) {
      throw new Error("All GitHub tokens are rate limited");
    }
    const resetAt = res.headers.get("x-ratelimit-reset");
    console.warn(
      `[GitHub] Rate limited (token ...${token.slice(-4)}), resets at: ${resetAt ? new Date(Number(resetAt) * 1000).toISOString() : "unknown"}`
    );
    return githubFetch(url, retries + 1);
  }

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText} for ${url}`);
  }

  return res.json();
}

export const MIN_STARS = 50000;

export async function fetchQualifyingRepos(): Promise<QualifyingRepo[]> {
  loadTokens();

  const allRepos: QualifyingRepo[] = [];

  // GitHub search returns max 1000 results per query.
  // Paginate by star ranges to get all repos with >= MIN_STARS.
  const ranges = buildStarRanges(MIN_STARS);

  for (const range of ranges) {
    let page = 1;
    const perPage = 100;

    while (true) {
      const q = encodeURIComponent(`stars:${range} is:public`);
      const url = `https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=${perPage}&page=${page}`;

      console.log(`[Pass 1] Searching stars:${range} page ${page}...`);
      const data = await githubFetch(url);

      for (const repo of data.items) {
        allRepos.push({
          name: repo.full_name,
          star_count: repo.stargazers_count,
          description: repo.description ?? null,
          language: repo.language ?? null,
          topics: repo.topics ?? [],
          license: repo.license?.spdx_id ?? null,
          homepage: repo.homepage || null,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          pushed_at: repo.pushed_at,
          forks_count: repo.forks_count,
          open_issues_count: repo.open_issues_count,
          size: repo.size,
          archived: repo.archived,
          owner_type: repo.owner?.type ?? "User",
        });
      }

      // If we got fewer than perPage, we've exhausted this range
      if (data.items.length < perPage || page * perPage >= 1000) {
        break;
      }
      page++;
    }
  }

  // Deduplicate (ranges might overlap at boundaries)
  const seen = new Set<string>();
  const unique = allRepos.filter((r) => {
    if (seen.has(r.name)) return false;
    seen.add(r.name);
    return true;
  });

  console.log(`[Pass 1] Found ${unique.length} repos with >= ${MIN_STARS} stars`);
  return unique.sort((a, b) => b.star_count - a.star_count);
}

// Build star ranges that each return < 1000 results.
// Uses logarithmic spacing since star counts follow a power law —
// many repos near the floor, few at the top. Log spacing puts
// roughly equal numbers of repos in each bucket.
function buildStarRanges(minStars: number): string[] {
  const maxStars = 1_000_000;
  const logMin = Math.log10(minStars);
  const logMax = Math.log10(maxStars);

  // ~10 breakpoints per order of magnitude keeps each bucket under 1000 results
  const numBuckets = Math.max(5, Math.ceil((logMax - logMin) * 10));
  const logStep = (logMax - logMin) / numBuckets;

  const breakpoints: number[] = [];
  for (let i = 0; i <= numBuckets; i++) {
    breakpoints.push(Math.round(Math.pow(10, logMin + logStep * i)));
  }

  // Deduplicate (rounding can produce duplicates when minStars is small)
  const unique = [...new Set(breakpoints)].sort((a, b) => b - a);

  const ranges: string[] = [];
  for (let i = 0; i < unique.length; i++) {
    if (i === 0) {
      ranges.push(`>=${unique[i]}`);
    } else {
      ranges.push(`${unique[i]}..${unique[i - 1] - 1}`);
    }
  }

  return ranges;
}
