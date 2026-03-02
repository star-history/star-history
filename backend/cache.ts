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

// Cache for rendered OG card SVGs, keyed by repo name.
// OG cards are ~100-200KB each; 1000 entries ≈ 100-200MB max.
export const ogCardCache = new LRUCache<string, string>({
  max: 1000,
  maxSize: 200 * 1024 * 1024,
  sizeCalculation: (value: string) => Buffer.byteLength(value),
  ttl: 1000 * 60 * 60 * 24,
  updateAgeOnGet: false,
});

// Cache for rendered chart SVGs, keyed by normalized query string.
// Avoids redundant D3 rendering + SVGO optimization for identical requests.
export const svgCache = new LRUCache<string, string>({
  max: 2000,
  maxSize: 400 * 1024 * 1024,
  sizeCalculation: (value: string) => Buffer.byteLength(value),
  ttl: 1000 * 60 * 60 * 24,
  updateAgeOnGet: false,
});

export default cache;
