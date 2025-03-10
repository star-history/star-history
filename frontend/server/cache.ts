import { LRUCache } from "lru-cache";
import utils from "../shared/common/utils";
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
  // based on the monthly visit count with `o/pv-star`.
  max: 80000,
  // max cache memory cost bytes: about 512Mb.
  maxSize: 512 * 1024 * 1024,
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
