/* eslint-disable @next/next/no-img-element */
import { AppStateProvider } from "../store"
import StarChartViewer from "../components/StarChartViewer"
import Head from "next/head"
import Link from "next/link"
import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import fs from "fs"
import path from "path"

const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
    Go: "#00ADD8", Rust: "#dea584", Java: "#b07219", "C++": "#f34b7d",
    C: "#555555", "C#": "#178600", Ruby: "#701516", PHP: "#4F5D95",
    Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB", Shell: "#89e051",
    Lua: "#000080", Scala: "#c22d40", Elixir: "#6e4a7e", Haskell: "#5e5086",
    Zig: "#ec915c", Vue: "#41b883", HTML: "#e34c26", CSS: "#563d7c",
    R: "#198CE7", Svelte: "#ff3e00", MDX: "#fcb32c", Nix: "#7e7eff",
    OCaml: "#3be133",
}

interface RepoCardData {
    name: string
    owner: string
    stars_total: number
    description: string | null
    language: string | null
    topics: string[]
    license: string | null
    homepage: string | null
    forks_count: number
    open_issues_count: number
    created_at: string | null
    archived: boolean
    size: number
    rank: number
    total_repos: number
}

interface RepoPageProps {
    repo: RepoCardData
}

function formatNumber(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k"
    return n.toString()
}

function formatSize(kb: number): string {
    if (kb >= 1_000_000) return (kb / 1_000_000).toFixed(1).replace(/\.0$/, "") + " GB"
    if (kb >= 1_000) return (kb / 1_000).toFixed(1).replace(/\.0$/, "") + " MB"
    return kb + " KB"
}

function repoAge(created: string): string {
    const diff = Date.now() - new Date(created).getTime()
    const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
    if (years >= 1) return `${years}y`
    const months = Math.floor(diff / (30.44 * 24 * 60 * 60 * 1000))
    return `${months}mo`
}

const RepoPage: NextPage<RepoPageProps> = ({ repo }) => {
    const title = `${repo.name} Star History`
    const description = repo.description
        ? `Star history and stats for ${repo.name}: ${repo.description}`
        : `View the star history chart for ${repo.name} on GitHub.`
    const canonicalUrl = `https://star-history.com/${repo.name.toLowerCase()}`
    const ogImage = `https://api.star-history.com/svg?repos=${repo.name}&type=Date`
    const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || "#6b7280" : null
    const repoShortName = repo.name.split("/")[1]
    const avatarUrl = `https://github.com/${repo.owner}.png?size=80`

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={ogImage} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={canonicalUrl} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={ogImage} />
            </Head>
            <AppStateProvider initialRepos={[repo.name]}>
                <div className="w-full h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-auto">
                    {/* Full-width landscape dashboard */}
                    <div className="w-full h-full flex flex-col p-4 lg:p-6 gap-4 lg:gap-5">

                        {/* === TOP ROW: Identity + Stats === */}
                        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 shrink-0">

                            {/* Identity panel */}
                            <div className="flex-1 bg-slate-800/60 rounded-xl border border-slate-700/50 p-5 flex flex-col gap-3">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={avatarUrl}
                                        alt={repo.owner}
                                        className="w-14 h-14 rounded-xl ring-2 ring-slate-600"
                                        loading="lazy"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h1 className="text-xl lg:text-2xl font-bold truncate">
                                                <span className="text-slate-400 font-normal">{repo.owner}/</span>{repoShortName}
                                            </h1>
                                            {repo.archived && (
                                                <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded font-medium shrink-0">
                                                    ARCHIVED
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-400">
                                            {repo.language && (
                                                <span className="flex items-center gap-1">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColor || "#6b7280" }} />
                                                    {repo.language}
                                                </span>
                                            )}
                                            {repo.license && <span>{repo.license}</span>}
                                            <span className="text-slate-500">#{repo.rank} of {repo.total_repos}</span>
                                        </div>
                                    </div>
                                </div>
                                {repo.description && (
                                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">{repo.description}</p>
                                )}
                                {repo.topics.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {repo.topics.slice(0, 5).map((t) => (
                                            <span key={t} className="px-2 py-0.5 bg-slate-700/60 text-slate-300 text-[11px] rounded-full">{t}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Raw stats grid */}
                            <div className="grid grid-cols-3 gap-3 lg:w-[420px] shrink-0">
                                <StatCard label="Stars" value={formatNumber(repo.stars_total)} icon="fas fa-star" iconColor="text-yellow-400" />
                                <StatCard label="Forks" value={formatNumber(repo.forks_count)} icon="fas fa-code-branch" iconColor="text-blue-400" />
                                <StatCard label="Issues" value={formatNumber(repo.open_issues_count)} icon="fas fa-exclamation-circle" iconColor="text-green-400" />
                                <StatCard label="Size" value={formatSize(repo.size)} icon="fas fa-database" iconColor="text-purple-400" />
                                <StatCard
                                    label="Age"
                                    value={repo.created_at ? repoAge(repo.created_at) : "—"}
                                    icon="fas fa-calendar"
                                    iconColor="text-orange-400"
                                />
                                <StatCard label="Rank" value={`#${repo.rank}`} icon="fas fa-trophy" iconColor="text-amber-400" />
                            </div>
                        </div>

                        {/* === MIDDLE ROW: Chart (dominant) === */}
                        <div className="flex-1 min-h-0 bg-slate-800/60 rounded-xl border border-slate-700/50 p-3 lg:p-4 flex flex-col">
                            <div className="flex-1 min-h-0 [&_svg]:!max-h-full">
                                <StarChartViewer compact />
                            </div>
                        </div>

                        {/* === BOTTOM ROW: Placeholder panels + Links === */}
                        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 shrink-0">

                            {/* Placeholder: Recent activity */}
                            <div className="flex-1 bg-slate-800/40 rounded-xl border border-dashed border-slate-600/50 p-5 flex items-center justify-center">
                                <span className="text-sm text-slate-500">Recent Activity (commits, PRs, releases)</span>
                            </div>

                            {/* Placeholder: Contributors */}
                            <div className="flex-1 bg-slate-800/40 rounded-xl border border-dashed border-slate-600/50 p-5 flex items-center justify-center">
                                <span className="text-sm text-slate-500">Top Contributors</span>
                            </div>

                            {/* Placeholder: Growth sparkline */}
                            <div className="flex-1 bg-slate-800/40 rounded-xl border border-dashed border-slate-600/50 p-5 flex items-center justify-center">
                                <span className="text-sm text-slate-500">Weekly Star Growth Sparkline</span>
                            </div>

                            {/* Links panel */}
                            <div className="lg:w-48 shrink-0 bg-slate-800/60 rounded-xl border border-slate-700/50 p-4 flex flex-col gap-2">
                                <a
                                    href={`https://github.com/${repo.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                                >
                                    <i className="fab fa-github text-white"></i>
                                    GitHub
                                </a>
                                {repo.homepage && (
                                    <a
                                        href={repo.homepage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                                    >
                                        <i className="fas fa-external-link-alt text-slate-400"></i>
                                        Website
                                    </a>
                                )}
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                                >
                                    <img src="/assets/icon.png" alt="" className="w-4 h-4" />
                                    star-history.com
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </AppStateProvider>
        </>
    )
}

function StatCard({ label, value, icon, iconColor }: {
    label: string; value: string; icon: string; iconColor: string
}) {
    return (
        <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-3 lg:p-4 flex flex-col items-center justify-center text-center gap-1">
            <i className={`${icon} ${iconColor} text-lg`}></i>
            <span className="text-lg lg:text-xl font-bold tabular-nums">{value}</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">{label}</span>
        </div>
    )
}

// --- Data loading ---

function loadRepoCards(): RepoCardData[] {
    try {
        const filePath = path.join(process.cwd(), "helpers", "repo-cards.json")
        return JSON.parse(fs.readFileSync(filePath, "utf-8"))
    } catch {
        return []
    }
}

interface LegacyRepoRow {
    name: string
    stars_total: number
    description: string | null
    language: string | null
    topics: string | null
    license: string | null
    homepage: string | null
    forks_count: number
    open_issues_count: number
    created_at: string | null
    archived: number
}

function loadLegacyRepos(): LegacyRepoRow[] {
    try {
        const filePath = path.join(process.cwd(), "helpers", "repos.json")
        return JSON.parse(fs.readFileSync(filePath, "utf-8"))
    } catch {
        return []
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const cards = loadRepoCards()
    const legacyRepos = loadLegacyRepos()
    const cardNames = new Set(cards.map(c => c.name.toLowerCase()))

    const paths = cards.map((card) => ({
        params: { slug: card.name.toLowerCase().split("/") },
    }))

    for (const repo of legacyRepos) {
        if (!cardNames.has(repo.name.toLowerCase())) {
            paths.push({ params: { slug: repo.name.toLowerCase().split("/") } })
        }
    }

    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<RepoPageProps> = async ({ params }) => {
    const slug = params?.slug
    if (!Array.isArray(slug) || slug.length !== 2) {
        return { notFound: true }
    }

    const fullName = slug.join("/")
    const cards = loadRepoCards()
    const cardData = cards.find((c) => c.name.toLowerCase() === fullName.toLowerCase())

    if (cardData) {
        return { props: { repo: cardData } }
    }

    // Fallback to legacy repos.json
    const legacyRepos = loadLegacyRepos()
    const repoData = legacyRepos.find((r) => r.name.toLowerCase() === fullName.toLowerCase())

    if (!repoData) {
        return { notFound: true }
    }

    let topics: string[] = []
    try {
        topics = repoData.topics ? JSON.parse(repoData.topics) : []
    } catch {
        topics = []
    }

    return {
        props: {
            repo: {
                name: repoData.name,
                owner: repoData.name.split("/")[0],
                stars_total: repoData.stars_total,
                description: repoData.description,
                language: repoData.language,
                topics,
                license: repoData.license,
                homepage: repoData.homepage,
                forks_count: repoData.forks_count,
                open_issues_count: repoData.open_issues_count,
                created_at: repoData.created_at,
                archived: repoData.archived === 1,
                size: 0,
                rank: 0,
                total_repos: 0,
            },
        },
    }
}

export default RepoPage
