export type ChartMode = "Date" | "Timeline";

export interface RepoStarData {
  repo: string;
  starRecords: {
    date: string;
    count: number;
  }[];
}

export interface RepoData {
  repo: string;
  starRecords: {
    date: string;
    count: number;
  }[];
  logoUrl: string;
}
