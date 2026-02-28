import fs from "fs";
import type { RepoCardData } from "../types/arena.js";

export const DEFAULT_MIN_STARS = 50000;

export interface RepoStore {
  min_stars: number;
  repos: RepoCardData[];
  getRepo(name: string): RepoCardData | null;
}

export function loadRepos(filePath: string): RepoStore {
  let min_stars = DEFAULT_MIN_STARS;
  let repos: RepoCardData[] = [];
  const repoMap = new Map<string, RepoCardData>();

  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    min_stars = raw.min_stars ?? DEFAULT_MIN_STARS;
    repos = raw.repos ?? [];
    for (const r of repos) {
      repoMap.set(r.name.toLowerCase(), r);
    }
    console.log(`Loaded ${repos.length} repos from ${filePath}`);
  } catch (err) {
    console.warn(`Failed to load ${filePath}:`, err);
  }

  return {
    min_stars,
    repos,
    getRepo: (name: string) => repoMap.get(name.toLowerCase()) ?? null,
  };
}
