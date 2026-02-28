import LRUCache from "lru-cache";
import utils from "../shared/common/utils.js";
import type { StarRecord } from "../shared/types/chart";

/**
 * A repo star data is type of RepoStarData, and its memory costs might be 896 bytes.
 * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
 */
interface RepoData {
  starRecords: StarRecord[];
  starAmount: number;
  logoUrl: string;
}

// Actually, we don't need LRU, but the memory control.
const options = {
  // the number of most recently used items to keep,
  max: 10000,
  // max cache memory cost bytes: about 1024MB.
  maxSize: 1024 * 1024 * 1024,
  // calc cache size with its bytes.
  sizeCalculation: (value: RepoData) => {
    return utils.calcBytes(value);
  },
  // max 24 hours to live.
  ttl: 1000 * 60 * 60 * 24,
  updateAgeOnGet: false,
};

const cache = new LRUCache<string, RepoData>(options);

export default cache;
