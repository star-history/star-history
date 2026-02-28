import React from "react"
import satori from "satori"
import { Resvg } from "@resvg/resvg-js"
import fs from "fs"
import path from "path"

// ---------- Data loading (mirrors helpers/repo-data.ts) ----------

interface RepoAttributes {
    stars: number; new_stars: number; pushes: number
    contributors: number; issues_closed: number; forks: number
}

interface RepoCardData {
    name: string; owner: string; stars_total: number
    description: string | null; language: string | null
    forks_count: number; created_at: string | null
    rank: number; attributes: RepoAttributes
}

interface LegacyRow {
    name: string; stars_total: number; description: string | null
    language: string | null; forks_count: number; created_at: string | null
}

function loadAllRepos(): RepoCardData[] {
    const cardsPath = path.join(process.cwd(), "helpers", "repo-cards.json")
    const legacyPath = path.join(process.cwd(), "helpers", "repos.json")

    let cards: RepoCardData[] = []
    try {
        const data = JSON.parse(fs.readFileSync(cardsPath, "utf-8"))
        cards = data.repos ?? []
    } catch { /* empty */ }

    const names = new Set(cards.map(c => c.name.toLowerCase()))
    const all = [...cards]

    try {
        const legacy: LegacyRow[] = JSON.parse(fs.readFileSync(legacyPath, "utf-8"))
        for (const r of legacy) {
            if (!names.has(r.name.toLowerCase())) {
                all.push({
                    name: r.name, owner: r.name.split("/")[0],
                    stars_total: r.stars_total, description: r.description,
                    language: r.language, forks_count: r.forks_count,
                    created_at: r.created_at, rank: 0,
                    attributes: { stars: 0, new_stars: 0, pushes: 0, contributors: 0, issues_closed: 0, forks: 0 },
                })
            }
        }
    } catch { /* empty */ }

    return all
}

// ---------- Helpers ----------

function fmt(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k"
    return n.toString()
}

function fmtDate(s: string): string {
    return new Date(s).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

const ATTRS: { key: keyof RepoAttributes; label: string }[] = [
    { key: "stars", label: "Stars" },
    { key: "new_stars", label: "New Stars" },
    { key: "forks", label: "Forks" },
    { key: "contributors", label: "Contributors" },
    { key: "pushes", label: "Pushes" },
    { key: "issues_closed", label: "Issues Closed" },
]

const LANG_COLORS: Record<string, string> = {
    TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
    Go: "#00ADD8", Rust: "#dea584", Java: "#b07219", "C++": "#f34b7d",
    C: "#555555", "C#": "#178600", Ruby: "#701516", PHP: "#4F5D95",
    Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB", Shell: "#89e051",
    Lua: "#000080", Scala: "#c22d40", Elixir: "#6e4a7e", Haskell: "#5e5086",
    Zig: "#ec915c", Vue: "#41b883", HTML: "#e34c26", CSS: "#563d7c",
    R: "#198CE7", Svelte: "#ff3e00", MDX: "#fcb32c", Nix: "#7e7eff",
    OCaml: "#3be133",
}

// ---------- Card renderer ----------

function ProgressBar({ value }: { value: number }) {
    const pct = Math.min(value, 100)
    const barW = 160
    const fillW = Math.round(barW * pct / 100)
    return (
        <div style={{ display: "flex", width: barW, height: 18, backgroundColor: "#f5f5f5", borderRadius: 9, overflow: "hidden" }}>
            {fillW > 0 && (
                <div style={{ width: fillW, height: "100%", backgroundColor: "#16a34a", borderRadius: 9, opacity: 0.85 }} />
            )}
        </div>
    )
}

function renderCard(repo: RepoCardData, logoBase64: string): React.ReactElement {
    const owner = repo.name.split("/")[0]
    const repoName = repo.name.split("/")[1]
    const avatarUrl = `https://avatars.githubusercontent.com/${owner}?s=200`
    const hasAttrs = repo.attributes && Object.values(repo.attributes).some(v => v > 0)
    const langColor = repo.language ? LANG_COLORS[repo.language] ?? "#6b7280" : null

    return (
        <div style={{
            display: "flex", flexDirection: "column",
            width: 1200, height: 630,
            backgroundColor: "white", fontFamily: "xkcd",
            padding: 48, position: "relative",
        }}>
            {/* Rank stamp (absolute top-right) */}
            {repo.rank > 0 && (
                <div style={{
                    display: "flex", position: "absolute", top: 32, right: 40,
                    transform: "rotate(-12deg)",
                }}>
                    <div style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: 110, height: 110, borderRadius: 55,
                        border: "3px solid #dc2626", padding: 5,
                    }}>
                        <div style={{
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                            width: "100%", height: "100%",
                            borderRadius: 50, border: "3px solid #dc2626", color: "#dc2626",
                        }}>
                            <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 3 }}>Global Rank</span>
                            <span style={{ fontSize: 26, fontWeight: "bold", lineHeight: 1 }}>#{repo.rank}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats row */}
            <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 22 }}>
                <span style={{ color: "#262626" }}>{fmt(repo.stars_total)} stars</span>
                <span style={{ color: "#525252" }}>{fmt(repo.forks_count)} forks</span>
                {repo.language && (
                    <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#525252" }}>
                        {langColor && <span style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: langColor }} />}
                        {repo.language}
                    </span>
                )}
                {repo.created_at && (
                    <span style={{ color: "#a3a3a3", fontSize: 20 }}>since {fmtDate(repo.created_at)}</span>
                )}
            </div>

            {/* Main content: avatar + info */}
            <div style={{ display: "flex", alignItems: "flex-start", marginTop: 28, flex: 1 }}>
                <img
                    src={avatarUrl}
                    width={140} height={140}
                    style={{ borderRadius: 16, flexShrink: 0 }}
                />
                <div style={{ display: "flex", flexDirection: "column", marginLeft: 24, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", fontSize: 36, fontWeight: "bold" }}>
                        <span style={{ color: "#a3a3a3", fontWeight: "normal" }}>{owner}</span>
                        <span style={{ color: "#d4d4d4", margin: "0 4px" }}>/</span>
                        <span style={{ color: "#171717" }}>{repoName}</span>
                    </div>
                    {repo.description && (
                        <span style={{ fontSize: 21, color: "#525252", marginTop: 12, lineHeight: 1.5 }}>
                            {repo.description.length > 140 ? repo.description.slice(0, 137) + "..." : repo.description}
                        </span>
                    )}
                </div>
            </div>

            {/* Attribute bars */}
            {hasAttrs && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: "auto" }}>
                    {/* Row 1 */}
                    <div style={{ display: "flex", gap: 32 }}>
                        {ATTRS.slice(0, 3).map(({ key, label }) => (
                            <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                                <span style={{ fontSize: 15, color: "#737373", width: 100, textAlign: "right" }}>{label}</span>
                                <ProgressBar value={repo.attributes[key]} />
                                <span style={{ fontSize: 15, color: "#a3a3a3", width: 28 }}>{repo.attributes[key]}</span>
                            </div>
                        ))}
                    </div>
                    {/* Row 2 */}
                    <div style={{ display: "flex", gap: 32 }}>
                        {ATTRS.slice(3, 6).map(({ key, label }) => (
                            <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                                <span style={{ fontSize: 15, color: "#737373", width: 100, textAlign: "right" }}>{label}</span>
                                <ProgressBar value={repo.attributes[key]} />
                                <span style={{ fontSize: 15, color: "#a3a3a3", width: 28 }}>{repo.attributes[key]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer branding */}
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginTop: hasAttrs ? 16 : "auto" }}>
                <img src={logoBase64} width={20} height={20} />
                <span style={{ fontSize: 18, color: "#a3a3a3" }}>star-history.com</span>
            </div>
        </div>
    )
}

// ---------- Main ----------

async function main() {
    const repos = loadAllRepos()
    const outputDir = path.join(process.cwd(), "public", "og")
    fs.mkdirSync(outputDir, { recursive: true })

    const xkcdFont = fs.readFileSync(path.join(process.cwd(), "styles", "xkcd.ttf"))
    const interFont = fs.readFileSync(path.join(process.cwd(), "styles", "Inter.ttf"))
    const logoBase64 = `data:image/png;base64,${fs.readFileSync(path.join(process.cwd(), "public", "assets", "logo-icon.png")).toString("base64")}`

    const fonts = [
        { name: "xkcd", data: xkcdFont, style: "normal" as const, weight: 400 as const },
        { name: "Inter", data: interFont, style: "normal" as const, weight: 400 as const },
    ]

    console.log(`Generating OG images for ${repos.length} repos...`)

    const BATCH = 20
    let done = 0

    for (let i = 0; i < repos.length; i += BATCH) {
        const batch = repos.slice(i, i + BATCH)
        await Promise.all(batch.map(async (repo) => {
            try {
                const svg = await satori(renderCard(repo, logoBase64), { width: 1200, height: 630, fonts })
                const png = new Resvg(svg, { fitTo: { mode: "width" as const, value: 1200 } }).render().asPng()
                const filename = repo.name.replace("/", "-").toLowerCase() + ".png"
                fs.writeFileSync(path.join(outputDir, filename), png)
                done++
            } catch (err) {
                console.error(`  Failed: ${repo.name}`, err instanceof Error ? err.message : err)
            }
        }))
        if (done % 100 === 0 || i + BATCH >= repos.length) {
            console.log(`  ${done}/${repos.length}`)
        }
    }

    console.log(`Done! Generated ${done} OG images in public/og/`)
}

main().catch(console.error)
