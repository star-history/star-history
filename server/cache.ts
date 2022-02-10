interface RepoStarData {
  starRecords: {
    date: string;
    count: number;
  }[];
  starAmount: number;
  lastUsedAt: number;
}

// The average memory consumption per data is about 48*16 bytes,
// so we can set the cache map max size with 1024.
const CACHE_MAP_MAX_SIZE = 1024;

/**
 * A easy data cache with Map struct in memory.
 * Its `key` is the repo name, and `value` is the RepoStarData.
 *
 * The `starAmount` field is used for comparing with the real-time star amount to check data validation.
 * For prevent OOM, the map has a max size. When map size more than the CACHE_MAP_MAX_SIZE,
 * the map will delete old data by `lastUsedAt` field in `setRepoStarDataCache` operation.
 */
const repoStarDataCache = new Map<string, RepoStarData>();

export const getRepoStarDataCache = (
  repo: string
): RepoStarData | undefined => {
  return repoStarDataCache.get(repo);
};

export const setRepoStarDataCache = (repo: string, data: RepoStarData) => {
  if (repoStarDataCache.size > CACHE_MAP_MAX_SIZE) {
    const sortedDataCache = Array.from(repoStarDataCache).sort(
      (a, b) => a[1].lastUsedAt - b[1].lastUsedAt
    );
    let index = 0;

    while (repoStarDataCache.size > CACHE_MAP_MAX_SIZE) {
      repoStarDataCache.delete(sortedDataCache[index][0]);
      index++;
    }
  }

  repoStarDataCache.set(repo, data);
};
