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
  total_repos: number | null;
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

const ATTR_LABELS: { key: string; label: string }[] = [
  { key: "stars", label: "Stars" },
  { key: "new_stars", label: "New Stars" },
  { key: "forks", label: "Forks" },
  { key: "contributors", label: "Contributors" },
  { key: "pushes", label: "Pushes" },
  { key: "issues_closed", label: "Issues" },
];

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
}

function fmtDate(s: string): string {
  return new Date(s).toLocaleDateString("en-US", { month: "short", year: "numeric" });
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

    // Rank stamp (top-right, rotated)
    data.rank && data.rank > 0
      ? h(
          "div",
          {
            style: {
              position: "absolute", top: 24, right: 40,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              width: 110, height: 110,
              border: "3px solid #dc2626", borderRadius: 55,
              transform: "rotate(-12deg)", opacity: 0.8,
              color: "#dc2626",
            },
          },
          h("span", { style: { fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em" } }, "Global Rank"),
          h("span", { style: { fontSize: 28, fontWeight: "bold", lineHeight: 1 } }, `#${data.rank}`),
          data.total_repos
            ? h("span", { style: { fontSize: 8, marginTop: 2 } }, `of ${fmt(data.total_repos)}`)
            : null,
        )
      : null,

    // Main content row: left info + right radar
    h(
      "div",
      { style: { display: "flex", flex: 1, gap: 32 } },

      // Left column: avatar + info
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", flex: 1 } },

        // Avatar + name
        h(
          "div",
          { style: { display: "flex", alignItems: "flex-start" } },
          // Wobbly-framed avatar
          h(
            "div",
            { style: { display: "flex", position: "relative", width: 120, height: 120, flexShrink: 0 } },
            h("img", {
              src: data.avatarBase64,
              width: 120, height: 120,
              style: { borderRadius: 14 },
            }),
            h(
              "svg",
              {
                viewBox: "0 0 100 100",
                width: 128, height: 128,
                style: { position: "absolute", top: -4, left: -4 },
              },
              h("path", {
                d: "M10,3 C25,1 75,2 90,4 C96,9 98,25 97,50 C98,75 96,91 91,96 C75,98 25,99 9,96 C3,91 2,75 3,50 C2,25 4,9 10,3 Z",
                fill: "none",
                stroke: "#525252",
                "stroke-width": "1.2",
                "stroke-linecap": "round",
              }),
            ),
          ),
          h(
            "div",
            { style: { display: "flex", flexDirection: "column", marginLeft: 24, flex: 1 } },
            // Name
            h(
              "div",
              { style: { display: "flex", alignItems: "baseline", fontSize: 34, fontWeight: "bold" } },
              h("span", { style: { color: "#a3a3a3", fontWeight: "normal" } }, owner),
              h("span", { style: { color: "#d4d4d4", margin: "0 5px" } }, "/"),
              h("span", { style: { color: "#171717" } }, repoName),
            ),
            // Description
            data.description
              ? h(
                  "span",
                  { style: { fontSize: 20, color: "#525252", marginTop: 14, lineHeight: 1.5 } },
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

        // Large stats
        h(
          "div",
          { style: { display: "flex", alignItems: "baseline", gap: 40, marginTop: "auto", paddingTop: 24 } },
          h(
            "div",
            { style: { display: "flex", flexDirection: "column" } },
            h("span", { style: { fontSize: 44, fontWeight: "bold", color: "#171717" } }, fmt(data.stars)),
            h("span", { style: { fontSize: 18, color: "#737373", marginTop: 2 } }, "stars"),
          ),
          h(
            "div",
            { style: { display: "flex", flexDirection: "column" } },
            h("span", { style: { fontSize: 44, fontWeight: "bold", color: "#525252" } }, fmt(data.forks)),
            h("span", { style: { fontSize: 18, color: "#737373", marginTop: 2 } }, "forks"),
          ),
        ),

        // Attribute progress bars (compact row)
        data.attributes
          ? h(
              "div",
              { style: { display: "flex", flexWrap: "wrap", gap: "6px 24px", marginTop: 18 } },
              ...ATTR_LABELS.map(({ key, label }) => {
                const value = (data.attributes as any)[key] as number;
                return h(
                  "div",
                  { style: { display: "flex", alignItems: "center", gap: 8, width: 180 } },
                  h("span", { style: { fontSize: 13, color: "#737373", width: 80, textAlign: "right" } }, label),
                  h(
                    "div",
                    { style: { display: "flex", flex: 1, height: 10, backgroundColor: "#f5f5f5", borderRadius: 5, overflow: "hidden" } },
                    h("div", {
                      style: {
                        width: `${Math.min(value, 99)}%`,
                        height: "100%",
                        backgroundColor: "#16a34a",
                        borderRadius: 5,
                        opacity: 0.85,
                      },
                    }),
                  ),
                  h("span", { style: { fontSize: 12, color: "#a3a3a3", width: 24 } }, String(value)),
                );
              }),
            )
          : null,
      ),

      // Right column: radar chart
      data.radarSvgBase64
        ? h(
            "div",
            { style: { display: "flex", alignItems: "center", justifyContent: "center", width: 380, flexShrink: 0 } },
            h("img", {
              src: data.radarSvgBase64,
              width: 360, height: 360,
            }),
          )
        : null,
    ),

    // Branding footer
    h(
      "div",
      { style: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginTop: 12 } },
      h("img", { src: data.logoBase64, width: 20, height: 20 }),
      h("span", { style: { fontSize: 16, color: "#a3a3a3" } }, "star-history.com"),
    ),
  );
}
