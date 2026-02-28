import fs from "fs";
import path from "path";
import type { RepoCardData } from "../shared/types/arena.js";

const DATA_PATH = path.join(process.cwd(), "data", "repos.json");

let repoMap: Map<string, RepoCardData> | null = null;

export function initRepoData(): void {
  try {
    const raw = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    const repos: RepoCardData[] = raw.repos ?? [];
    repoMap = new Map();
    for (const r of repos) {
      repoMap.set(r.name.toLowerCase(), r);
    }
    console.log(`Loaded ${repoMap.size} repos from repos.json`);
  } catch (err) {
    console.warn("Failed to load repos.json:", err);
    repoMap = new Map();
  }
}

export function getRepoCard(repoName: string): RepoCardData | null {
  if (!repoMap) initRepoData();
  return repoMap!.get(repoName.toLowerCase()) ?? null;
}
