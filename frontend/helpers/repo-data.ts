import fs from "fs"
import path from "path"

export type { RepoCardData, RepoAttributes } from "@shared/types/arena"
import type { RepoCardData } from "@shared/types/arena"

export const DEFAULT_MIN_STARS = 50000

export function loadRepos(): { min_stars: number; repos: RepoCardData[] } {
    try {
        const filePath = path.join(process.cwd(), "..", "arena", "data", "repos.json")
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
        return { min_stars: data.min_stars ?? DEFAULT_MIN_STARS, repos: data.repos ?? [] }
    } catch (err) {
        console.warn("Failed to load repos.json:", err)
        return { min_stars: DEFAULT_MIN_STARS, repos: [] }
    }
}
