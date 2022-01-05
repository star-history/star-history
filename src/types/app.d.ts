type ChartMode = "Date" | "Timeline";

interface AppState {
  isFetching: boolean;
  token: string;
  repos: string[];
  chartMode: ChartMode;
}

interface RepoStarData {
  repo: string;
  starRecords: {
    date: string;
    count: number;
  }[];
}
