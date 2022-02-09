interface RepoStarData {
  starRecords: {
    date: string;
    count: number;
  }[];
  starAmount: number;
}

/**
 * memory data cache
 */
export const repoStarDataCache = new Map<string, RepoStarData>();
