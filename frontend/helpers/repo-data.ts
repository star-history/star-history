import fs from "fs"
import path from "path"

export const DEFAULT_MIN_STARS = 50000

export interface RepoCardData {
    name: string
    owner: string
    stars_total: number
    description: string | null
    language: string | null
    topics: string[]
    license: string | null
    homepage: string | null
    forks_count: number
    open_issues_count: number
    created_at: string | null
    archived: boolean
    size: number
    rank: number
    total_repos: number
    attributes: RepoAttributes
}

export interface RepoAttributes {
    stars: number
    new_stars: number
    pushes: number
    contributors: number
    issues_closed: number
    forks: number
}

export interface LegacyRepoRow {
    name: string
    stars_total: number
    description: string | null
    language: string | null
    topics: string | null
    license: string | null
    homepage: string | null
    forks_count: number
    open_issues_count: number
    created_at: string | null
    archived: number
}

export function loadRepoCards(): { min_stars: number; repos: RepoCardData[] } {
    try {
        const filePath = path.join(process.cwd(), "helpers", "repo-cards.json")
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
        return { min_stars: data.min_stars ?? DEFAULT_MIN_STARS, repos: data.repos ?? [] }
    } catch {
        return { min_stars: DEFAULT_MIN_STARS, repos: [] }
    }
}

export function loadLegacyRepos(): LegacyRepoRow[] {
    try {
        const filePath = path.join(process.cwd(), "helpers", "repos.json")
        return JSON.parse(fs.readFileSync(filePath, "utf-8"))
    } catch {
        return []
    }
}
