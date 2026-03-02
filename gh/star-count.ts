interface Tier {
  threshold: number;
  label: string;
  count: number;
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
  { threshold: 0, label: "0+" },
];

export async function fetchStarCount(
  githubFetch: (url: string) => Promise<any>
): Promise<Tier[]> {
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

  return tiers;
}
