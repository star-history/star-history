import LRUCache from "lru-cache";
import { MAX_REQUEST_AMOUNT } from "./const";

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
  // track the items total size.
  maxSize: 2048 * MAX_REQUEST_AMOUNT,
  // the most resource-consuming is star record list, so its length could be used for the data size.
  // usually its length should be less then MAX_REQUEST_AMOUNT.
  sizeCalculation: (value: RepoStarData) => {
    return value.starRecords.length;
  },
  // max 6 hours to live.
  ttl: 1000 * 60 * 60 * 6,
  updateAgeOnGet: false,
};

const cache = new LRUCache<string, RepoStarData>(options);

export default cache;
