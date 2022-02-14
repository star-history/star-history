import LRUCache from "lru-cache";

const options = {
  // the number of most recently used items to keep.
  max: 2048,

  // update the "recently-used"-ness of items on cache.has()
  updateRecencyOnHas: true,
};

interface RepoStarData {
  starRecords: {
    date: string;
    count: number;
  }[];
  starAmount: number;
}

const cache = new LRUCache<string, RepoStarData>(options);

export default cache;
