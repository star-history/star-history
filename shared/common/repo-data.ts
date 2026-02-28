import fs from "fs";
import path from "path";
import type { RepoCardData } from "../types/gh.js";

const DEFAULT_MIN_STARS = 50000;

const REPOS_PATH = path.join(process.cwd(), "..", "gh", "data", "repos.json");

export interface RepoStore {
  min_stars: number;
  repos: RepoCardData[];
  getRepo(name: string): RepoCardData | null;
}

export function loadRepos(): RepoStore {
  let min_stars = DEFAULT_MIN_STARS;
  let repos: RepoCardData[] = [];
  const repoMap = new Map<string, RepoCardData>();

  try {
    const raw = JSON.parse(fs.readFileSync(REPOS_PATH, "utf-8"));
    min_stars = raw.min_stars ?? DEFAULT_MIN_STARS;
    repos = raw.repos ?? [];
    for (const r of repos) {
      repoMap.set(r.name.toLowerCase(), r);
    }
    console.log(`Loaded ${repos.length} repos from ${REPOS_PATH}`);
  } catch (err) {
    console.warn(`Failed to load ${REPOS_PATH}:`, err);
  }

  return {
    min_stars,
    repos,
    getRepo: (name: string) => repoMap.get(name.toLowerCase()) ?? null,
  };
}
