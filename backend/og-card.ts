import satori from "satori";
import fs from "fs";
import path from "path";
import { buildLandscape1 } from "../shared/packages/card-landscape1.js";
import { renderRadarSvg } from "../shared/packages/radar-svg.js";
import type { RepoAttributes } from "../shared/types/arena.js";

export interface OgCardInput {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  license: string | null;
  created_at: string | null;
  avatarBase64: string;
  attributes: RepoAttributes | null;
  rank: number | null;
}

// ---------- Assets (loaded once at init) ----------

let xkcdFont: Buffer;
let interFont: Buffer;
let logoBase64: string;

export function initOgAssets() {
  const dir = path.join(process.cwd(), "assets");
  xkcdFont = fs.readFileSync(path.join(dir, "xkcd.ttf"));
  interFont = fs.readFileSync(path.join(dir, "Inter.ttf"));
  logoBase64 = `data:image/png;base64,${fs
    .readFileSync(path.join(dir, "logo-icon.png"))
    .toString("base64")}`;
}

// ---------- Public API ----------

export async function renderOgCard(data: OgCardInput): Promise<string> {
  let radarSvgBase64: string | null = null;
  if (data.attributes && Object.values(data.attributes).some((v) => v > 0)) {
    const radarSvg = renderRadarSvg(data.attributes, 400);
    radarSvgBase64 = `data:image/svg+xml;base64,${Buffer.from(radarSvg).toString("base64")}`;
  }

  const vnode = buildLandscape1({
    ...data,
    radarSvgBase64,
    logoBase64,
  });

  return satori(vnode, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "xkcd", data: xkcdFont, style: "normal" as const, weight: 400 as const },
      { name: "Inter", data: interFont, style: "normal" as const, weight: 400 as const },
    ],
  });
}
