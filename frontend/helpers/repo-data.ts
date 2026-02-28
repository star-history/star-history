import fs from "fs"
import path from "path"

export type { RepoCardData, RepoAttributes, LegacyRepoRow } from "../../arena/types"
import type { RepoCardData, LegacyRepoRow } from "../../arena/types"

export const DEFAULT_MIN_STARS = 50000

export function loadRepoCards(): { min_stars: number; repos: RepoCardData[] } {
    try {
        const filePath = path.join(process.cwd(), "..", "arena", "data", "repo-cards.json")
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
        return { min_stars: data.min_stars ?? DEFAULT_MIN_STARS, repos: data.repos ?? [] }
    } catch {
        return { min_stars: DEFAULT_MIN_STARS, repos: [] }
    }
}

export function loadLegacyRepos(): LegacyRepoRow[] {
    try {
        const filePath = path.join(process.cwd(), "..", "arena", "data", "repos.json")
        return JSON.parse(fs.readFileSync(filePath, "utf-8"))
    } catch {
        return []
    }
}
