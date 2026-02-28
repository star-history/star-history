import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "fs";
import path from "path";

// Lightweight element builder for satori — avoids React dependency
function h(type: string, props: Record<string, any> | null, ...children: any[]): any {
  const flat = children.flat(Infinity).filter((c) => c != null && c !== false);
  return {
    type,
    props: {
      ...(props || {}),
      children:
        flat.length === 0 ? undefined : flat.length === 1 ? flat[0] : flat,
    },
  };
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

// ---------- Types ----------

export interface CardData {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  license: string | null;
  created_at: string | null;
  avatarBase64: string;
}

// ---------- Helpers ----------

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Go: "#00ADD8", Rust: "#dea584", Java: "#b07219", "C++": "#f34b7d",
  C: "#555555", "C#": "#178600", Ruby: "#701516", PHP: "#4F5D95",
  Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB", Shell: "#89e051",
  Lua: "#000080", Scala: "#c22d40", Elixir: "#6e4a7e", Haskell: "#5e5086",
  Zig: "#ec915c", Vue: "#41b883", HTML: "#e34c26", CSS: "#563d7c",
  R: "#198CE7", Svelte: "#ff3e00", MDX: "#fcb32c", Nix: "#7e7eff",
  OCaml: "#3be133",
};

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

function fmtDate(s: string): string {
  return new Date(s).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// ---------- Card builder ----------

function buildCard(data: CardData) {
  const [owner, repoName] = data.name.split("/");
  const langColor = data.language ? LANG_COLORS[data.language] ?? "#6b7280" : null;

  return h(
    "div",
    {
      style: {
        display: "flex", flexDirection: "column",
        width: 1200, height: 630,
        backgroundColor: "white", fontFamily: "xkcd",
        padding: 48,
      },
    },
    // Main content: avatar + info
    h(
      "div",
      { style: { display: "flex", alignItems: "flex-start", flex: 1 } },
      h("img", {
        src: data.avatarBase64,
        width: 140, height: 140,
        style: { borderRadius: 16, flexShrink: 0 },
      }),
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", marginLeft: 28, flex: 1 } },
        // Name
        h(
          "div",
          { style: { display: "flex", alignItems: "baseline", fontSize: 38, fontWeight: "bold" } },
          h("span", { style: { color: "#a3a3a3", fontWeight: "normal" } }, owner),
          h("span", { style: { color: "#d4d4d4", margin: "0 6px" } }, "/"),
          h("span", { style: { color: "#171717" } }, repoName),
        ),
        // Description
        data.description
          ? h(
              "span",
              { style: { fontSize: 22, color: "#525252", marginTop: 16, lineHeight: 1.5 } },
              data.description.length > 140
                ? data.description.slice(0, 137) + "..."
                : data.description,
            )
          : null,
        // Meta: language · license · since date
        h(
          "div",
          { style: { display: "flex", alignItems: "center", gap: 20, marginTop: 16, fontSize: 20, color: "#737373" } },
          data.language
            ? h(
                "span",
                { style: { display: "flex", alignItems: "center", gap: 8 } },
                langColor
                  ? h("span", { style: { width: 12, height: 12, borderRadius: 6, backgroundColor: langColor } })
                  : null,
                data.language,
              )
            : null,
          data.license ? h("span", {}, data.license) : null,
          data.created_at
            ? h("span", { style: { color: "#a3a3a3" } }, "since " + fmtDate(data.created_at))
            : null,
        ),
      ),
    ),
    // Large stats
    h(
      "div",
      { style: { display: "flex", alignItems: "baseline", gap: 48, marginTop: "auto", paddingTop: 32 } },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        h("span", { style: { fontSize: 48, fontWeight: "bold", color: "#171717" } }, fmt(data.stars)),
        h("span", { style: { fontSize: 20, color: "#737373", marginTop: 4 } }, "stars"),
      ),
      h(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        h("span", { style: { fontSize: 48, fontWeight: "bold", color: "#525252" } }, fmt(data.forks)),
        h("span", { style: { fontSize: 20, color: "#737373", marginTop: 4 } }, "forks"),
      ),
    ),
    // Branding footer
    h(
      "div",
      { style: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginTop: 20 } },
      h("img", { src: logoBase64, width: 20, height: 20 }),
      h("span", { style: { fontSize: 18, color: "#a3a3a3" } }, "star-history.com"),
    ),
  );
}

// ---------- Public API ----------

export async function renderOgCard(data: CardData): Promise<Buffer> {
  const svg = await satori(buildCard(data), {
    width: 1200,
    height: 630,
    fonts: [
      { name: "xkcd", data: xkcdFont, style: "normal" as const, weight: 400 as const },
      { name: "Inter", data: interFont, style: "normal" as const, weight: 400 as const },
    ],
  });
  const resvg = new Resvg(svg, { fitTo: { mode: "width" as const, value: 1200 } });
  return Buffer.from(resvg.render().asPng());
}
