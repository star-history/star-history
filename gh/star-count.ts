import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { formatDate } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "data");
const OUT_PATH = path.join(OUT_DIR, "star-count.json");

interface Tier {
  threshold: number;
  label: string;
  count: number;
}

interface StarCountData {
  updated_at: string;
  tiers: Tier[];
}

const THRESHOLDS: { threshold: number; label: string }[] = [
  { threshold: 100000, label: "100K+" },
  { threshold: 50000, label: "50K+" },
  { threshold: 20000, label: "20K+" },
  { threshold: 10000, label: "10K+" },
  { threshold: 5000, label: "5K+" },
  { threshold: 3000, label: "3K+" },
  { threshold: 1000, label: "1K+" },
  { threshold: 500, label: "500+" },
  { threshold: 100, label: "100+" },
  { threshold: 1, label: "1+" },
];

export async function fetchStarCount(
  githubFetch: (url: string) => Promise<any>
): Promise<StarCountData> {
  console.log("\n[Star Count] Fetching repo counts by star threshold...");

  const tiers: Tier[] = [];

  for (const { threshold, label } of THRESHOLDS) {
    const q = encodeURIComponent(`stars:>=${threshold} is:public`);
    const url = `https://api.github.com/search/repositories?q=${q}&per_page=1`;

    console.log(`[Star Count] stars:>=${threshold} (${label})...`);
    const data = await githubFetch(url);
    const count: number = data.total_count;

    tiers.push({ threshold, label, count });
    console.log(`[Star Count]   ${label}: ${count.toLocaleString()} repos`);
  }

  const today = formatDate(new Date());
  const result: StarCountData = {
    updated_at: today,
    tiers,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(result, null, 2) + "\n");
  console.log(`[Star Count] Wrote ${OUT_PATH}`);

  return result;
}
