interface AppState {
  isFetching: boolean;
  token: string;
  repos: string[];
}

interface RepoStarData {
  repo: string;
  starRecords: {
    date: string;
    count: number;
  }[];
}
