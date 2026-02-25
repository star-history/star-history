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
    const langColor = repo.language ? LANGUAGE_COLORS[repo.language] ?? "#6b7280" : null
    const repoShortName = repo.name.split("/")[1]
    const avatarUrl = `https://github.com/${repo.owner}.png?size=80`

    const stats: { label: string; value: string }[] = [
        { label: "Stars", value: formatNumber(repo.stars_total) },
        { label: "Forks", value: formatNumber(repo.forks_count) },
        { label: "Open issues", value: formatNumber(repo.open_issues_count) },
        { label: "Size", value: formatSize(repo.size) },
        { label: "Age", value: repo.created_at ? repoAge(repo.created_at) : "—" },
    ]

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
                <div className="min-h-screen bg-white text-neutral-900 antialiased">
                    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-6">

                        {/* Identity */}
                        <div className="flex items-start gap-4">
                            <img
                                src={avatarUrl}
                                alt={repo.owner}
                                className="w-10 h-10 rounded-full"
                                loading="lazy"
                            />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h1 className="text-2xl font-semibold">
                                        <Link href={`https://github.com/${repo.owner}`} className="text-neutral-400 hover:underline">{repo.owner}</Link>
                                        <span className="text-neutral-300 mx-0.5">/</span>
                                        <Link href={`https://github.com/${repo.name}`} className="hover:underline">{repoShortName}</Link>
                                    </h1>
                                    {repo.archived && (
                                        <span className="text-xs text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded font-medium">archived</span>
                                    )}
                                </div>
                                {repo.description && (
                                    <p className="text-sm text-neutral-600 mt-1 leading-relaxed">{repo.description}</p>
                                )}
                                <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400 flex-wrap">
                                    {repo.language && (
                                        <span className="flex items-center gap-1">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColor! }} />
                                            {repo.language}
                                        </span>
                                    )}
                                    {repo.license && <span>{repo.license}</span>}
                                    {repo.topics.length > 0 && repo.topics.slice(0, 5).map((t) => (
                                        <span key={t} className="text-neutral-500">{t}</span>
                                    ))}
                                </div>
                            </div>
                            {repo.rank > 0 && (
                                <div className="shrink-0 text-right">
                                    <span className="text-3xl font-bold font-mono text-neutral-900">#{repo.rank}</span>
                                    <p className="text-xs text-neutral-400 mt-0.5">Global Rank</p>
                                </div>
                            )}
                        </div>

                        {/* Stats table */}
                        <div className="border border-neutral-200 rounded-md overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-neutral-200 bg-neutral-50">
                                        {stats.map((s) => (
                                            <th key={s.label} className="px-4 py-2 text-left font-medium text-neutral-500 text-xs uppercase tracking-wide">
                                                {s.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {stats.map((s) => (
                                            <td key={s.label} className="px-4 py-3 font-mono font-semibold text-neutral-900">
                                                {s.value}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Chart */}
                        <div className="border border-neutral-200 rounded-md p-2 md:p-4">
                            <StarChartViewer compact />
                        </div>

                        {/* Bottom panels */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Placeholder: Recent activity */}
                            <div className="border border-dashed border-neutral-300 rounded-md p-6 flex items-center justify-center min-h-[120px]">
                                <span className="text-sm text-neutral-400">Recent Activity (commits, PRs, releases)</span>
                            </div>

                            {/* Placeholder: Contributors */}
                            <div className="border border-dashed border-neutral-300 rounded-md p-6 flex items-center justify-center min-h-[120px]">
                                <span className="text-sm text-neutral-400">Top Contributors</span>
                            </div>

                            {/* Placeholder: Growth sparkline */}
                            <div className="border border-dashed border-neutral-300 rounded-md p-6 flex items-center justify-center min-h-[120px]">
                                <span className="text-sm text-neutral-400">Weekly Star Growth Sparkline</span>
                            </div>
                        </div>

                        {/* Footer links */}
                        <div className="flex items-center gap-4 text-sm pt-2 pb-4">
                            <a
                                href={`https://github.com/${repo.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-600 hover:text-neutral-900 underline underline-offset-2"
                            >
                                GitHub
                            </a>
                            {repo.homepage && (
                                <a
                                    href={repo.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-neutral-600 hover:text-neutral-900 underline underline-offset-2"
                                >
                                    Website
                                </a>
                            )}
                            <Link href="/" className="text-neutral-600 hover:text-neutral-900 underline underline-offset-2">
                                star-history.com
                            </Link>
                        </div>
                    </div>
                </div>
            </AppStateProvider>
        </>
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
            },
        },
    }
}

export default RepoPage
