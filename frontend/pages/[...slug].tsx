/* eslint-disable @next/next/no-img-element */
import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { formatNumber } from "../helpers/format"
import { loadRepoCards, loadLegacyRepos } from "../helpers/repo-data"
import type { RepoCardData } from "../helpers/repo-data"
import PageShell from "../components/PageShell"
import { SketchGitHubIcon } from "../components/GitHubStarButton"
import RadarChart, { ATTRIBUTE_LABELS } from "../components/Charts/RadarChart"

type LayoutMode = "landscape" | "portrait"

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

const XKCD_ROTATIONS = [-0.3, 0.4, -0.2, 0.35, -0.4, 0.25]

interface RepoPageProps {
    repo: RepoCardData
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

const AttributeBars = ({ repo }: { repo: RepoCardData }) => (
    <div className="grid grid-cols-2 gap-x-6 gap-y-5 px-1">
        {ATTRIBUTE_LABELS.map(({ key, label }, i) => {
            const value = repo.attributes[key];
            const pct = Math.min(value, 100);
            const w = pct * 1.94;
            return (
                <div key={key} className="flex items-center gap-3" style={{ transform: `rotate(${XKCD_ROTATIONS[i % XKCD_ROTATIONS.length]}deg)` }}>
                    <span className="text-base text-neutral-500 w-28 text-right shrink-0">{label}</span>
                    <div className="flex-1 h-10">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 20">
                            <path
                                d="M2,2 C30,0.5 70,3.5 100,1.5 C130,0.5 170,3.5 198,1.5 C199,5 198.5,10 199,15.5 C198,17.5 170,15.5 130,18 C100,17 70,18.5 30,17.5 C10,18 2,17 1,15.5 C0.5,11 1,5.5 2,2 Z"
                                fill="#f5f5f5" stroke="#d4d4d4" strokeWidth="0.8"
                            />
                            {pct > 2 && (
                                <path
                                    d={`M2,2 C${w*0.3},1 ${w*0.6},4.5 ${w*0.85},2 L${w},2.5 C${w+0.5},6 ${w},11 ${w+0.5},16 L${w},16.5 C${w*0.6},15.5 ${w*0.3},18 2,17 C0,12 0,6 2,2 Z`}
                                    fill="#16a34a" opacity="0.85"
                                />
                            )}
                        </svg>
                    </div>
                    <span className="text-base text-neutral-400 w-9 shrink-0">{value}</span>
                </div>
            );
        })}
    </div>
)

const LayoutToggle = ({ mode, onChange, wide }: { mode: LayoutMode; onChange: (m: LayoutMode) => void; wide: boolean }) => (
    <div className={`relative flex items-center justify-center mb-4 w-full ${wide ? "max-w-5xl" : "max-w-2xl"}`} style={{ fontFamily: '"xkcd", cursive' }}>
        <Link href="/" className="absolute left-0 inline-flex items-center gap-1.5 text-lg text-neutral-400 hover:text-neutral-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.5 13L5.5 8L10.5 3" />
            </svg>
            Back to home
        </Link>
        <div className="inline-flex rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <button
                onClick={() => onChange("landscape")}
                className={`px-3 py-2 transition-colors ${
                    mode === "landscape" ? "bg-neutral-800 text-white" : "text-neutral-500 hover:bg-neutral-50"
                }`}
                title="Landscape"
            >
                <svg width="24" height="18" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5,2 C8,1.5 16,2.5 21.5,1.8 C22.5,2.5 22.2,5 22.5,9 C22.2,13 22.8,15 21.5,15.8 C16,16.5 8,15.5 2.5,16 C1.5,15 1.8,12 1.5,9 C1.8,5 1.2,3 2.5,2 Z" />
                </svg>
            </button>
            <button
                onClick={() => onChange("portrait")}
                className={`px-3 py-2 transition-colors ${
                    mode === "portrait" ? "bg-neutral-800 text-white" : "text-neutral-500 hover:bg-neutral-50"
                }`}
                title="Portrait"
            >
                <svg width="16" height="22" viewBox="0 0 16 22" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5,2 C5,1.5 11,2.5 13.5,1.8 C14.5,2.5 14.2,7 14.5,11 C14.2,15 14.8,18 13.5,19.8 C11,20.5 5,19.5 2.5,20 C1.5,19 1.8,15 1.5,11 C1.8,7 1.2,3 2.5,2 Z" />
                </svg>
            </button>
        </div>
    </div>
)

const RepoPage: NextPage<RepoPageProps> = ({ repo }) => {
    const [layout, setLayout] = useState<LayoutMode>("landscape")
    const title = `${repo.name} Star History`
    const description = repo.description
        ? `Star history and stats for ${repo.name}: ${repo.description}`
        : `View the star history chart for ${repo.name} on GitHub.`
    const canonicalUrl = `https://star-history.com/${repo.name.toLowerCase()}`
    const ogImage = `https://api.star-history.com/svg?repos=${repo.name}&type=Date`
    const langColor = repo.language ? LANGUAGE_COLORS[repo.language] ?? "#6b7280" : null
    const repoShortName = repo.name.split("/")[1]
    const avatarUrl = `https://github.com/${repo.owner}.png?size=460`
    const hasAttributes = repo.attributes && Object.values(repo.attributes).some(v => v > 0)
    const isLandscape = layout === "landscape"

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
            <PageShell>
                <LayoutToggle mode={layout} onChange={setLayout} wide={isLandscape} />

                {isLandscape ? (
                    /* ── Landscape layout (Pokemon card style) ── */
                    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden" style={{ fontFamily: '"xkcd", cursive' }}>
                        {/* Combined header bar: language + stats + rank + logo */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 text-sm text-neutral-500">
                            <div className="flex items-center gap-5 flex-wrap">
                                <span className="text-base text-neutral-800 -rotate-1">
                                    ⭐ {formatNumber(repo.stars_total)}
                                </span>
                                <span className="text-base text-neutral-600 rotate-[0.5deg]">
                                    🍴 {formatNumber(repo.forks_count)}
                                </span>
                                {repo.created_at && (
                                    <span className="text-sm text-neutral-400 -rotate-[0.5deg]">
                                        since {formatDate(repo.created_at)}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                {repo.rank > 0 && (
                                    <span className="text-xl font-bold text-neutral-800">
                                        <span className="text-sm text-neutral-400 font-normal mr-1">Global Rank</span>#{repo.rank}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Top: radar (left) + avatar (right) */}
                        <div className="flex flex-col md:flex-row px-4 pb-4">
                            {/* Left half: radar */}
                            <div className="flex-1 min-w-0 flex flex-col items-center justify-center">
                                {hasAttributes && (
                                    <RadarChart attributes={repo.attributes} />
                                )}
                            </div>

                            {/* Right half: ID card */}
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-full flex flex-col items-center gap-4">
                                    <img
                                        src={avatarUrl}
                                        alt={repo.owner}
                                        className="w-full max-w-[280px] aspect-square rounded-full"
                                        loading="lazy"
                                    />
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <h1 className="text-3xl font-bold leading-tight">
                                                <span className="text-neutral-400 font-normal">{repo.owner}</span>
                                                <span className="text-neutral-300 mx-0.5">/</span>
                                                <span>{repoShortName}</span>
                                            </h1>
                                            <a href={`https://github.com/${repo.name}`} target="_blank" rel="noopener noreferrer"
                                                className="text-neutral-400 hover:text-neutral-700 transition-colors"
                                            >
                                                <SketchGitHubIcon size={28} />
                                            </a>
                                        </div>
                                        {repo.description && (
                                            <p className="text-base text-neutral-500 mt-3 leading-relaxed">{repo.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom: stat bars + logo */}
                        <div className="px-6 pb-6">
                            {hasAttributes && (
                                <AttributeBars repo={repo} />
                            )}
                            <div className="flex justify-end mt-4">
                                <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">
                                    <img src="/assets/logo-full.svg" alt="star-history" className="h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── Portrait layout ── */
                    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Type bar */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 text-xs text-neutral-500" style={{ fontFamily: '"xkcd", cursive' }}>
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
                            {repo.rank > 0 && (
                                <span className="font-semibold text-neutral-700">
                                    <span className="text-neutral-400 font-normal">Global Rank</span> #{repo.rank}
                                </span>
                            )}
                        </div>

                        {/* Identity */}
                        <div className="px-5 pt-5 pb-4">
                            <div className="flex items-start gap-3">
                                <img src={avatarUrl} alt={repo.owner} className="w-12 h-12 rounded-full shrink-0" loading="lazy" />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h1 className="text-xl font-bold leading-tight" style={{ fontFamily: '"xkcd", cursive' }}>
                                            <span className="text-neutral-400 font-normal">{repo.owner}</span>
                                            <span className="text-neutral-300 mx-0.5">/</span>
                                            <span>{repoShortName}</span>
                                        </h1>
                                        <a href={`https://github.com/${repo.name}`} target="_blank" rel="noopener noreferrer"
                                            className="text-neutral-400 hover:text-neutral-700 transition-colors leading-tight"
                                        >
                                            <SketchGitHubIcon size={22} />
                                        </a>
                                    </div>
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

                        {hasAttributes && (
                            <div className="border-t border-neutral-100 px-4 py-4" style={{ fontFamily: '"xkcd", cursive' }}>
                                <RadarChart attributes={repo.attributes} />
                                <div className="mt-4">
                                    <AttributeBars repo={repo} />
                                </div>
                            </div>
                        )}

                        {/* Footer stats */}
                        <div className="border-t border-neutral-100 px-5 py-4" style={{ fontFamily: '"xkcd", cursive' }}>
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-5 flex-wrap">
                                    <span className="inline-block text-lg text-neutral-800 -rotate-1">
                                        ⭐ {formatNumber(repo.stars_total)}
                                    </span>
                                    <span className="inline-block text-base text-neutral-600 rotate-[0.5deg]">
                                        🍴 {formatNumber(repo.forks_count)}
                                    </span>
                                    {repo.created_at && (
                                        <span className="inline-block text-sm text-neutral-400 -rotate-[0.5deg]">
                                            since {formatDate(repo.created_at)}
                                        </span>
                                    )}
                                </div>
                                <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">
                                    <img src="/assets/logo-full.svg" alt="star-history" className="h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </PageShell>
        </>
    )
}

// --- Data loading ---

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

    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<RepoPageProps> = async ({ params }) => {
    const { repos: cards } = loadRepoCards()

    const slug = params?.slug
    if (!Array.isArray(slug) || slug.length !== 2) {
        return { notFound: true }
    }

    const fullName = slug.join("/")
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
                attributes: { stars: 0, new_stars: 0, pushes: 0, contributors: 0, issues_closed: 0, forks: 0 },
            },
        },
    }
}

export default RepoPage
