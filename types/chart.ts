export type ChartMode = "Date" | "Timeline";

export interface RepoStarData {
  repo: string;
  starRecords: {
    date: string;
    count: number;
  }[];
}
