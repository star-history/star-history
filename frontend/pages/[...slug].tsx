/* eslint-disable @next/next/no-img-element */
import Head from "next/head"
import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { formatNumber } from "../helpers/format"
import { loadRepoCards, loadLegacyRepos } from "../helpers/repo-data"
import type { RepoCardData } from "../helpers/repo-data"
import PageShell from "../components/PageShell"
import RadarChart, { ATTRIBUTE_LABELS } from "../components/Charts/RadarChart"

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
            <PageShell>
                    {/* Card */}
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
                                <img
                                    src={avatarUrl}
                                    alt={repo.owner}
                                    className="w-12 h-12 rounded-full shrink-0"
                                    loading="lazy"
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h1 className="text-xl font-bold leading-tight" style={{ fontFamily: '"xkcd", cursive' }}>
                                            <span className="text-neutral-400 font-normal">{repo.owner}</span>
                                            <span className="text-neutral-300 mx-0.5">/</span>
                                            <span>{repoShortName}</span>
                                        </h1>
                                        <a href={`https://github.com/${repo.name}`} target="_blank" rel="noopener noreferrer"
                                            className="text-neutral-400 hover:text-neutral-700 transition-colors text-xl leading-tight"
                                        >
                                            <i className="fab fa-github" />
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

                        {/* Radar Chart + Attribute Bars */}
                        {hasAttributes && (
                            <div className="border-t border-b border-neutral-100 px-4 py-4" style={{ fontFamily: '"xkcd", cursive' }}>
                                <RadarChart attributes={repo.attributes} />
                                <div className="mt-4 space-y-2.5 px-1">
                                    {ATTRIBUTE_LABELS.map(({ key, label }, i) => {
                                        const value = repo.attributes[key];
                                        const pct = Math.min(value, 100);
                                        const w = pct * 1.94;
                                        return (
                                            <div key={key} className="flex items-center gap-3" style={{ transform: `rotate(${XKCD_ROTATIONS[i % XKCD_ROTATIONS.length]}deg)` }}>
                                                <span className="text-xs text-neutral-500 w-24 text-right shrink-0">{label}</span>
                                                <div className="flex-1 h-3.5">
                                                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 12">
                                                        {/* Hand-drawn track */}
                                                        <path
                                                            d="M2,2 C30,0.5 70,3 100,1.5 C130,0.5 170,3 198,1.5 C199,3 198.5,6 199,9 C198,10.5 170,9 130,11 C100,10 70,11.5 30,10.5 C10,11 2,10 1,9 C0.5,6.5 1,4 2,2 Z"
                                                            fill="#f5f5f5" stroke="#d4d4d4" strokeWidth="0.8"
                                                        />
                                                        {/* Hand-drawn fill */}
                                                        {pct > 2 && (
                                                            <path
                                                                d={`M2,2 C${w*0.3},1 ${w*0.6},3.5 ${w*0.85},2 L${w},2.5 C${w+0.5},4.5 ${w},7 ${w+0.5},9.5 L${w},10 C${w*0.6},9 ${w*0.3},11 2,10 C0,7.5 0,4.5 2,2 Z`}
                                                                fill="#16a34a" opacity="0.85"
                                                            />
                                                        )}
                                                    </svg>
                                                </div>
                                                <span className="text-xs text-neutral-400 w-8 shrink-0">{value}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Footer – xkcd-style stats */}
                        <div className="relative px-5 py-4" style={{ fontFamily: '"xkcd", cursive' }}>
                            {/* Hand-drawn wobbly top border */}
                            <svg className="absolute top-0 left-3 right-3 h-[3px]" preserveAspectRatio="none" viewBox="0 0 200 3">
                                <path d="M0,1.5 C8,0.4 16,2.6 30,1.3 C44,0.3 56,2.7 75,1.5 C94,0.4 106,2.6 125,1.5 C144,0.3 156,2.7 175,1.3 C189,0.4 195,2.5 200,1.5" fill="none" stroke="#d4d4d4" strokeWidth="1.5" />
                            </svg>
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
                                <a href="/" className="opacity-60 hover:opacity-100 transition-opacity">
                                    <img src="/assets/logo-full.svg" alt="star-history" className="h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
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
