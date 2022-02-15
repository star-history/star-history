import LRUCache from "lru-cache";
import utils from "../common/utils";

/**
 * A repo star data is type of RepoStarData, and its memory costs might be 896 bytes.
 *
 * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
 */
interface RepoStarData {
  starRecords: {
    date: string;
    count: number;
  }[];
  starAmount: number;
}

const options = {
  // the number of most recently used items to keep.
  max: 2048,
  // max cache memory cost bytes: 2Mb.
  maxSize: 2 * 1024 * 1024,
  // calc cache size with its bytes.
  sizeCalculation: (value: RepoStarData) => {
    return utils.calcBytes(value);
  },
  // max 6 hours to live.
  ttl: 1000 * 60 * 60 * 6,
  updateAgeOnGet: false,
};

const cache = new LRUCache<string, RepoStarData>(options);

export default cache;
