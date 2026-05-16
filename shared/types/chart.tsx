export type ChartMode = "Date" | "Timeline"

export type LegendPosition = "auto" | "top-left" | "top-right" | "bottom-left" | "bottom-right"

export interface StarRecord {
    date: string
    count: number
}

export interface RepoStarData {
    repo: string
    starRecords: StarRecord[]
}

export interface RepoData extends RepoStarData {
    logoUrl: string
}
