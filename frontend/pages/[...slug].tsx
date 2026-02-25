/* eslint-disable @next/next/no-img-element */
import { useState } from "react"
import { useRouter } from "next/router"
import { GITHUB_REPO_URL_REG } from "../helpers/consts"
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

interface RepoAttributes {
    popularity: number
    momentum: number
    activity: number
    community: number
    health: number
    influence: number
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
    attributes: RepoAttributes
}

interface RepoPageProps {
    repo: RepoCardData | null
    minStars: number
}

function formatNumber(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M"
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k"
    return n.toString()
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

const ATTRIBUTE_CONFIG: { key: keyof RepoAttributes; label: string; color: string }[] = [
    { key: "popularity", label: "Popularity", color: "bg-yellow-400" },
    { key: "momentum", label: "Momentum", color: "bg-green-500" },
    { key: "activity", label: "Activity", color: "bg-red-500" },
    { key: "community", label: "Community", color: "bg-blue-500" },
    { key: "health", label: "Health", color: "bg-purple-500" },
    { key: "influence", label: "Influence", color: "bg-orange-500" },
]

function NavInput() {
    const router = useRouter()
    const [navInput, setNavInput] = useState("")

    const handleNavSubmit = () => {
        let raw = navInput.trim()
        if (!raw) return

        if (GITHUB_REPO_URL_REG.test(raw)) {
            const match = raw.match(GITHUB_REPO_URL_REG)
            if (match) raw = match[1]
        }

        const parts = raw.split("/").filter(Boolean)
        if (parts.length === 1) {
            router.push(`/${parts[0]}/${parts[0]}`)
        } else if (parts.length >= 2) {
            router.push(`/${parts[0]}/${parts[1]}`)
        }
    }

    return (
        <div className="w-full max-w-2xl mb-4 flex items-center rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <input
                type="text"
                value={navInput}
                onChange={(e) => setNavInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNavSubmit()}
                placeholder="star-history or star-history/star-history or https://github.com/star-history/star-history"
                className="flex-1 h-10 px-4 text-sm outline-none placeholder:text-neutral-400"
            />
            <button
                onClick={handleNavSubmit}
                className="h-10 px-4 text-sm text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 border-l border-neutral-200 transition-colors"
            >
                Go
            </button>
        </div>
    )
}

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-neutral-900 antialiased">
            <div className="flex flex-col items-center px-4 py-8 md:py-12">
                <NavInput />
                {children}
                <div className="mt-6 text-sm text-neutral-400">
                    <Link href="/" className="hover:text-neutral-600 transition-colors">star-history.com</Link>
                </div>
            </div>
        </div>
    )
}

const RepoPage: NextPage<RepoPageProps> = ({ repo, minStars }) => {
    const router = useRouter()
    const slug = router.query.slug
    const repoName = Array.isArray(slug) ? slug.join("/") : ""

    if (!repo) {
        return (
            <PageShell>
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-5 py-16 text-center">
                        <p className="text-4xl mb-3">🔭</p>
                        <h1 className="text-lg font-semibold text-neutral-800">
                            {repoName ? <span className="font-mono">{repoName}</span> : "Repository"} not found
                        </h1>
                        <p className="text-sm text-neutral-500 mt-2">
                            We only track repositories with over {formatNumber(minStars)} stars. Try another repository in the search box above.
                        </p>
                    </div>
                </div>
            </PageShell>
        )
    }

    const title = `${repo.name} Star History`
    const description = repo.description
        ? `Star history and stats for ${repo.name}: ${repo.description}`
        : `View the star history chart for ${repo.name} on GitHub.`
    const canonicalUrl = `https://star-history.com/${repo.name.toLowerCase()}`
    const ogImage = `https://api.star-history.com/svg?repos=${repo.name}&type=Date`
    const langColor = repo.language ? LANGUAGE_COLORS[repo.language] ?? "#6b7280" : null
    const repoShortName = repo.name.split("/")[1]
    const avatarUrl = `https://github.com/${repo.owner}.png?size=80`
    const hasAttributes = repo.attributes && Object.values(repo.attributes).some(v => v > 0)

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
                <PageShell>
                    {/* Card */}
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">

                        {/* Type bar */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 text-xs text-neutral-500">
                            <div className="flex items-center gap-3">
                                {repo.language && (
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: langColor! }} />
                                        {repo.language}
                                    </span>
                                )}
                                {repo.license && (
                                    <span className="text-neutral-400">{repo.license}</span>
                                )}
                            </div>
                            {repo.rank > 0 && repo.total_repos > 0 && (
                                <span className="font-mono font-semibold text-neutral-700">
                                    #{repo.rank} <span className="text-neutral-400 font-normal">of {repo.total_repos}</span>
                                </span>
                            )}
                        </div>

                        {/* Identity */}
                        <div className="px-5 pt-5 pb-4">
                            <div className="flex items-start gap-3">
                                <img
                                    src={avatarUrl}
                                    alt={repo.owner}
                                    className="w-12 h-12 rounded-full shrink-0"
                                    loading="lazy"
                                />
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-xl font-bold leading-tight">
                                        <span className="text-neutral-400 font-normal">{repo.owner}</span>
                                        <span className="text-neutral-300 mx-0.5">/</span>
                                        <span>{repoShortName}</span>
                                    </h1>
                                    {repo.description && (
                                        <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed">{repo.description}</p>
                                    )}
                                    {repo.topics.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {repo.topics.slice(0, 5).map((t) => (
                                                <span key={t} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="border-t border-b border-neutral-100 px-2 py-2 md:px-4 md:py-3">
                            <StarChartViewer compact />
                        </div>

                        {/* Attributes */}
                        {hasAttributes && (
                            <div className="px-5 py-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                                    {ATTRIBUTE_CONFIG.map(({ key, label, color }) => {
                                        const value = repo.attributes[key]
                                        return (
                                            <div key={key} className="flex items-center gap-2">
                                                <span className="text-xs text-neutral-500 w-20 shrink-0">{label}</span>
                                                <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${color}`}
                                                        style={{ width: `${value}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-mono font-semibold text-neutral-700 w-6 text-right">{value}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100 text-sm text-neutral-500">
                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="font-mono font-semibold text-neutral-800">⭐ {formatNumber(repo.stars_total)}</span>
                                <span className="font-mono text-neutral-600">🍴 {formatNumber(repo.forks_count)}</span>
                                {repo.created_at && (
                                    <span className="text-neutral-400">📅 {formatDate(repo.created_at)}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <a
                                    href={`https://github.com/${repo.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-neutral-500 hover:text-neutral-800 transition-colors"
                                >
                                    GitHub ↗
                                </a>
                                {repo.homepage && (
                                    <a
                                        href={repo.homepage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-neutral-500 hover:text-neutral-800 transition-colors"
                                    >
                                        Web ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </PageShell>
            </AppStateProvider>
        </>
    )
}

// --- Data loading ---

const DEFAULT_MIN_STARS = 100000

function loadRepoCards(): { min_stars: number; repos: RepoCardData[] } {
    try {
        const filePath = path.join(process.cwd(), "helpers", "repo-cards.json")
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
        return { min_stars: data.min_stars ?? DEFAULT_MIN_STARS, repos: data.repos ?? [] }
    } catch {
        return { min_stars: DEFAULT_MIN_STARS, repos: [] }
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
    const { repos: cards } = loadRepoCards()
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

    return { paths, fallback: "blocking" }
}

export const getStaticProps: GetStaticProps<RepoPageProps> = async ({ params }) => {
    const { min_stars: minStars, repos: cards } = loadRepoCards()

    const slug = params?.slug
    if (!Array.isArray(slug) || slug.length !== 2) {
        return { props: { repo: null, minStars } }
    }

    const fullName = slug.join("/")
    const cardData = cards.find((c) => c.name.toLowerCase() === fullName.toLowerCase())

    if (cardData) {
        return { props: { repo: cardData, minStars } }
    }

    // Fallback to legacy repos.json
    const legacyRepos = loadLegacyRepos()
    const repoData = legacyRepos.find((r) => r.name.toLowerCase() === fullName.toLowerCase())

    if (!repoData) {
        return { props: { repo: null, minStars } }
    }

    let topics: string[] = []
    try {
        topics = repoData.topics ? JSON.parse(repoData.topics) : []
    } catch {
        topics = []
    }

    return {
        props: {
            minStars,
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
                attributes: { popularity: 0, momentum: 0, activity: 0, community: 0, health: 0, influence: 0 },
            },
        },
    }
}

export default RepoPage
