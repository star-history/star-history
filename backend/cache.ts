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

// --- Hit/miss counters ---

interface CacheCounters {
  hits: number;
  misses: number;
}

const counters: Record<string, CacheCounters> = {
  starData: { hits: 0, misses: 0 },
  svgChart: { hits: 0, misses: 0 },
  ogCard: { hits: 0, misses: 0 },
};

export function recordCacheHit(name: string) {
  counters[name].hits++;
}

export function recordCacheMiss(name: string) {
  counters[name].misses++;
}

// --- Human-readable byte formatting ---

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(1)} ${units[i]}`;
}

function cacheStats(name: string, c: LRUCache<string, unknown>) {
  const { hits, misses } = counters[name];
  const total = hits + misses;
  return {
    entries: c.size,
    memory: formatBytes(c.calculatedSize),
    hits,
    misses,
    hitRate: total > 0 ? `${((hits / total) * 100).toFixed(1)}%` : "N/A",
  };
}

export function getAllCacheStats() {
  return {
    starData: cacheStats("starData", cache as LRUCache<string, unknown>),
    svgChart: cacheStats("svgChart", svgCache as LRUCache<string, unknown>),
    ogCard: cacheStats("ogCard", ogCardCache as LRUCache<string, unknown>),
  };
}

// --- Caches ---

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
