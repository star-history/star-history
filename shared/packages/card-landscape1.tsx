/**
 * Clean OG card layout (landscape1) — uses the h() helper pattern.
 * Works with both satori (backend) and React (frontend).
 *
 * 1200×630 layout: left side = repo info + stats, right side = radar chart.
 */

// Lightweight element builder — avoids React runtime dependency
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

/** Build an organic wax-blob path (slightly irregular circle). */
function waxBlobPath(cx: number, cy: number, r: number): string {
  const points = 64;
  const step = (Math.PI * 2) / points;
  const parts: string[] = [];
  for (let i = 0; i <= points; i++) {
    const a = step * i;
    // Gentle organic wobble via layered sines
    const wobble = r
      + 3.5 * Math.sin(a * 3 + 1.2)
      + 2 * Math.sin(a * 5 + 0.7)
      + 1.5 * Math.cos(a * 7 + 2.1);
    const x = cx + Math.cos(a) * wobble;
    const y = cy + Math.sin(a) * wobble;
    parts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)},${y.toFixed(1)}`);
  }
  parts.push("Z");
  return parts.join(" ");
}

export interface Landscape1Data {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  license: string | null;
  created_at: string | null;
  avatarBase64: string;
  radarSvgBase64: string | null;
  attributes: { stars: number; new_stars: number; pushes: number; contributors: number; issues_closed: number; forks: number } | null;
  rank: number | null;
  logoBase64: string;
}

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

const WOBBLY_PATH = "M10,3 C25,1 75,2 90,4 C96,9 98,25 97,50 C98,75 96,91 91,96 C75,98 25,99 9,96 C3,91 2,75 3,50 C2,25 4,9 10,3 Z";

const SEAL_LAYER_BASE = {
  position: "absolute" as const, width: 160, height: 160,
  display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center",
};

function sealTextLayer(
  rank: number, date: string,
  colors: { label: string; rank: string; date: string },
  offset: { top: number; left: number },
  opacity?: number,
) {
  return h(
    "div",
    { style: { ...SEAL_LAYER_BASE, top: offset.top, left: offset.left, ...(opacity != null ? { opacity } : {}) } },
    h("span", { style: { fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: colors.label } }, "Global Rank"),
    h("span", { style: { fontSize: 42, fontWeight: "bold", lineHeight: 1, color: colors.rank } }, `#${rank}`),
    h("span", { style: { fontSize: 9, marginTop: 4, color: colors.date, letterSpacing: "0.05em" } }, date),
  );
}

export function buildLandscape1(data: Landscape1Data) {
  const [owner, repoName] = data.name.split("/");
  const langColor = data.language ? LANG_COLORS[data.language] ?? "#6b7280" : null;

  return h(
    "div",
    {
      style: {
        display: "flex", flexDirection: "column",
        width: 1200, height: 630,
        backgroundColor: "white", fontFamily: "xkcd",
        padding: "40px 48px",
        position: "relative",
      },
    },

    // Sealing wax rank badge (top-right)
    data.rank && data.rank > 0
      ? h(
          "div",
          {
            style: {
              position: "absolute", top: 10, right: 24,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              width: 160, height: 160,
              transform: "rotate(-8deg)",
            },
          },
          // Wax blob shape
          h(
            "svg",
            {
              viewBox: "0 0 160 160",
              width: 160, height: 160,
              style: { position: "absolute", top: 0, left: 0 },
            },
            // Shadow — soft offset
            h("path", { d: waxBlobPath(83, 83, 68), fill: "#44000028" }),
            // Main wax body
            h("path", { d: waxBlobPath(80, 80, 68), fill: "#e13129" }),
            // Inner groove ring
            h("circle", { cx: "80", cy: "80", r: "52", fill: "none", stroke: "#b02420", "stroke-width": "1.8", opacity: "0.5" }),
            // Inner groove highlight
            h("circle", { cx: "80", cy: "80", r: "51", fill: "none", stroke: "#e8a070", "stroke-width": "0.6", opacity: "0.25" }),
          ),
          // Embossed gold text — three layers: shadow, body, highlight
          ...(() => {
            const date = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const dark = "#6e1510";
            return [
              sealTextLayer(data.rank!, date, { label: dark, rank: dark, date: dark }, { top: 1.5, left: 1 }),
              sealTextLayer(data.rank!, date, { label: "#e8b830", rank: "#f0c838", date: "#e8b830" }, { top: 0, left: 0 }),
              sealTextLayer(data.rank!, date, { label: "#ffe870", rank: "#ffe870", date: "#ffe870" }, { top: -0.5, left: -0.5 }, 0.45),
            ];
          })(),
        )
      : null,

    // Main content row: left info + right radar
    h(
      "div",
      { style: { display: "flex", flex: 1, gap: 32 } },

      // Left column: avatar + info
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", flex: 1, minWidth: 0, justifyContent: "center" } },

        // Name (full width, above avatar row)
        h(
          "div",
          { "data-repo-name": true, style: { display: "flex", alignItems: "baseline", flexWrap: "wrap", fontSize: 34, fontWeight: "bold" } },
          h("span", { style: { color: "#a3a3a3", fontWeight: "normal" } }, owner),
          h("span", { style: { color: "#d4d4d4", margin: "0 5px" } }, "/"),
          h("span", { style: { color: "#171717" } }, repoName),
        ),

        // Avatar + description row
        h(
          "div",
          { style: { display: "flex", alignItems: "flex-start", marginTop: 16 } },
          // Wobbly-framed avatar (fixed 140×140 square)
          h(
            "svg",
            {
              viewBox: "0 0 100 100",
              width: 140, height: 140,
              style: { flexShrink: 0 },
            },
            h("defs", null,
              h("clipPath", { id: "wobbly-clip" },
                h("path", {
                  d: WOBBLY_PATH,
                }),
              ),
            ),
            h("image", {
              href: data.avatarBase64,
              x: "0", y: "0", width: "100", height: "100",
              preserveAspectRatio: "xMidYMid slice",
              "clip-path": "url(#wobbly-clip)",
            }),
            h("path", {
              d: WOBBLY_PATH,
              fill: "none",
              stroke: "#525252",
              "stroke-width": "1.2",
              "stroke-linecap": "round",
            }),
          ),
          h(
            "div",
            { style: { display: "flex", flexDirection: "column", marginLeft: 24, flex: 1 } },
            // Description
            data.description
              ? h(
                  "span",
                  { style: { fontSize: 20, color: "#525252", lineHeight: 1.5 } },
                  data.description.length > 120
                    ? data.description.slice(0, 117) + "..."
                    : data.description,
                )
              : null,
            // Meta: language · license · since
            h(
              "div",
              { style: { display: "flex", alignItems: "center", gap: 18, marginTop: 14, fontSize: 18, color: "#737373" } },
              data.language
                ? h(
                    "span",
                    { style: { display: "flex", alignItems: "center", gap: 7 } },
                    langColor
                      ? h("span", { style: { width: 11, height: 11, borderRadius: 6, backgroundColor: langColor } })
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

        // Stats: absolute numbers
        h(
          "div",
          { style: { display: "flex", alignItems: "center", gap: 24, marginTop: 60 } },
          h(
            "div",
            { title: `Stars: ${data.stars.toLocaleString()}` + (data.attributes ? ` · Top ${100 - data.attributes.stars}%` : ""), style: { display: "flex", alignItems: "center", gap: 8 } },
            h(
              "svg",
              { viewBox: "0 0 24 24", width: 24, height: 24 },
              h("path", {
                d: "M12 2L14.9 8.6L22 9.3L16.8 14L18.2 21L12 17.3L5.8 21L7.2 14L2 9.3L9.1 8.6Z",
                fill: "#facc15", stroke: "#a3a3a3", "stroke-width": "1.2", "stroke-linecap": "round", "stroke-linejoin": "round",
              }),
            ),
            h("span", { style: { fontSize: 36, fontWeight: "bold", color: "#171717" } }, fmt(data.stars)),
          ),
          h(
            "div",
            { title: `Forks: ${data.forks.toLocaleString()}` + (data.attributes ? ` · Top ${100 - data.attributes.forks}%` : ""), style: { display: "flex", alignItems: "center", gap: 8 } },
            h(
              "svg",
              { viewBox: "0 0 32 24", width: 30, height: 24 },
              // Fork: tines
              h("path", { d: "M3 2V10", fill: "none", stroke: "#a3a3a3", "stroke-width": "1.4", "stroke-linecap": "round" }),
              h("path", { d: "M7 2V10", fill: "none", stroke: "#a3a3a3", "stroke-width": "1.4", "stroke-linecap": "round" }),
              h("path", { d: "M11 2V10", fill: "none", stroke: "#a3a3a3", "stroke-width": "1.4", "stroke-linecap": "round" }),
              h("path", { d: "M15 2V10", fill: "none", stroke: "#a3a3a3", "stroke-width": "1.4", "stroke-linecap": "round" }),
              // Fork: neck
              h("path", { d: "M3 10C3 13 5 14 9 14C13 14 15 13 15 10", fill: "none", stroke: "#a3a3a3", "stroke-width": "1.4", "stroke-linecap": "round" }),
              // Fork: handle
              h("path", { d: "M9 14V22", fill: "none", stroke: "#a3a3a3", "stroke-width": "1.8", "stroke-linecap": "round" }),
              // Knife: blade
              h("path", { d: "M22 2C22 2 25 3 25 8C25 11 24 13 23 14", fill: "none", stroke: "#a3a3a3", "stroke-width": "1.4", "stroke-linecap": "round", "stroke-linejoin": "round" }),
              h("path", { d: "M22 2V14", fill: "none", stroke: "#a3a3a3", "stroke-width": "1.4", "stroke-linecap": "round" }),
              // Knife: handle
              h("path", { d: "M22 14V22", fill: "none", stroke: "#a3a3a3", "stroke-width": "1.8", "stroke-linecap": "round" }),
            ),
            h("span", { style: { fontSize: 36, fontWeight: "bold", color: "#525252" } }, fmt(data.forks)),
          ),
          data.attributes
            ? h(
                "div",
                { title: `Contributors: ${data.attributes.contributors} · Top ${100 - data.attributes.contributors}%`, style: { display: "flex", alignItems: "center", gap: 8 } },
                h(
                  "svg",
                  { viewBox: "0 0 32 24", width: 30, height: 24 },
                  // Left person: head + body
                  h("circle", { cx: "7", cy: "6", r: "3.5", fill: "none", stroke: "#a3a3a3", "stroke-width": "1.3" }),
                  h("path", { d: "M1 22C1 17 3.5 14 7 14C10.5 14 13 17 13 22", fill: "none", stroke: "#a3a3a3", "stroke-width": "1.3", "stroke-linecap": "round" }),
                  // Right person: head + body (slightly behind)
                  h("circle", { cx: "22", cy: "6", r: "3.5", fill: "none", stroke: "#a3a3a3", "stroke-width": "1.3" }),
                  h("path", { d: "M16 22C16 17 18.5 14 22 14C25.5 14 28 17 28 22", fill: "none", stroke: "#a3a3a3", "stroke-width": "1.3", "stroke-linecap": "round" }),
                ),
                h("span", { style: { fontSize: 36, fontWeight: "bold", color: "#525252" } }, String(data.attributes.contributors)),
              )
            : null,
        ),

        // Stats: weekly numbers
        data.attributes
          ? h(
              "div",
              { style: { display: "flex", alignItems: "center", gap: 20, marginTop: 14, paddingTop: 14, borderTop: "1.5px solid #f0f0f0" } },
              h("span", { style: { fontSize: 16, color: "#a3a3a3", textTransform: "uppercase", letterSpacing: "0.08em" } }, "Weekly"),
              h(
                "div",
                { title: `New stars: ${data.attributes.new_stars} · Top ${100 - data.attributes.new_stars}%`, style: { display: "flex", alignItems: "baseline", gap: 5 } },
                h("span", { style: { fontSize: 34, fontWeight: "bold", color: "#525252" } }, String(data.attributes.new_stars)),
                h("span", { style: { fontSize: 15, color: "#a3a3a3" } }, "stars"),
              ),
              h("span", { style: { fontSize: 14, color: "#d4d4d4" } }, "\u00b7"),
              h(
                "div",
                { title: `Pushes: ${data.attributes.pushes} · Top ${100 - data.attributes.pushes}%`, style: { display: "flex", alignItems: "baseline", gap: 5 } },
                h("span", { style: { fontSize: 34, fontWeight: "bold", color: "#525252" } }, String(data.attributes.pushes)),
                h("span", { style: { fontSize: 15, color: "#a3a3a3" } }, "pushes"),
              ),
              h("span", { style: { fontSize: 14, color: "#d4d4d4" } }, "\u00b7"),
              h(
                "div",
                { title: `Issues closed: ${data.attributes.issues_closed} · Top ${100 - data.attributes.issues_closed}%`, style: { display: "flex", alignItems: "baseline", gap: 5 } },
                h("span", { style: { fontSize: 34, fontWeight: "bold", color: "#525252" } }, String(data.attributes.issues_closed)),
                h("span", { style: { fontSize: 15, color: "#a3a3a3" } }, "issues closed"),
              ),
            )
          : null,
      ),

      // Right column: radar chart
      data.radarSvgBase64
        ? h(
            "div",
            { style: { display: "flex", alignItems: "center", justifyContent: "center", width: 580, flexShrink: 0 } },
            h("img", {
              src: data.radarSvgBase64,
              width: 560, height: 560,
            }),
          )
        : null,
    ),

    // Branding footer (pinned bottom-right)
    h(
      "div",
      { style: { position: "absolute", bottom: 20, right: 48, display: "flex", alignItems: "center", gap: 8 } },
      h("img", { src: data.logoBase64, width: 24, height: 24, style: { opacity: 0.6 } }),
      h("span", { style: { fontSize: 19, color: "#b5b5b5", letterSpacing: "0.02em" } }, "star-history.com"),
    ),
  );
}
