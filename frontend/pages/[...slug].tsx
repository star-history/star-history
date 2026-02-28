/* eslint-disable @next/next/no-img-element */
import Head from "next/head"
import Link from "next/link"
import { useCallback, useRef } from "react"
import { toPng } from "html-to-image"
import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { formatNumber } from "../helpers/format"
import { loadRepoCards, loadLegacyRepos } from "../helpers/repo-data"
import type { RepoCardData } from "../helpers/repo-data"
import PageShell from "../components/PageShell"
import { SketchStarIcon, SketchForkIcon } from "../components/SketchIcons"
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

interface RepoPageProps {
    repo: RepoCardData
    minStars: number
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

const AttributeBars = ({ repo }: { repo: RepoCardData }) => (
    <div className="flex flex-wrap gap-x-6 gap-y-1.5">
        {ATTRIBUTE_LABELS.map(({ key, label }) => {
            const value = repo.attributes[key];
            return (
                <div key={key} className="flex items-center gap-2 w-[180px]">
                    <span className="text-[13px] text-neutral-500 w-20 text-right shrink-0">{label}</span>
                    <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-600 rounded-full"
                            style={{ width: `${Math.min(value, 99)}%`, opacity: 0.85 }}
                        />
                    </div>
                    <span className="text-xs text-neutral-400 w-6 shrink-0">{value}</span>
                </div>
            );
        })}
    </div>
)

const Toolbar = ({ onDownload, tweetUrl }: { onDownload: () => void; tweetUrl: string }) => (
    <div className="flex items-center mb-2 w-full max-w-5xl" style={{ fontFamily: '"xkcd", cursive' }}>
        <div className="flex-1">
            <Link href="/" className="inline-flex items-center gap-1.5 text-lg text-neutral-400 hover:text-neutral-600 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.5 13L5.5 8L10.5 3" />
                </svg>
                Back to home
            </Link>
        </div>
        <div className="flex items-center gap-3">
            <button
                onClick={onDownload}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                title="Download as PNG"
            >
                <svg width="24" height="24" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11,2.5 C11.3,5 10.8,8 11.2,11.5" />
                    <path d="M7,8.5 C8.5,10 10,11.5 11.1,12.5 C12,11.5 13.5,10 15,8.5" />
                    <path d="M3.5,16 C7,16.5 15,15.5 18.5,16.2" />
                    <path d="M3.5,18.5 C7,19 15,18 18.5,18.7" />
                </svg>
            </button>
            <a
                href={tweetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-neutral-600 transition-colors text-sm border border-neutral-200 rounded-lg px-2.5 py-1.5"
            >
                Share on <span className="font-bold">X</span>
            </a>
        </div>
    </div>
)

const RepoPage: NextPage<RepoPageProps> = ({ repo, minStars }) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const title = `${repo.name} GitHub Star History - ${formatNumber(repo.stars_total)} Stars`
    const descParts = [
        `Star history and stats for ${repo.name}`,
        repo.description ? `: ${repo.description}` : "",
        `. ${formatNumber(repo.stars_total)} stars`,
        repo.forks_count ? `, ${formatNumber(repo.forks_count)} forks` : "",
        repo.language ? `. Built with ${repo.language}` : "",
        repo.created_at ? `. Created ${formatDate(repo.created_at)}` : "",
    ]
    const description = descParts.join("").slice(0, 160)
    const canonicalUrl = `https://star-history.com/${repo.name.toLowerCase()}`
    const ogImage = `https://api.star-history.com/svg?repos=${repo.name}&style=landscape1`
    const tweetText = `${repo.name} - ${formatNumber(repo.stars_total)} stars on GitHub`
    const tweetUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(tweetText)}`
    const repoShortName = repo.name.split("/")[1]
    const avatarUrl = `https://avatars.githubusercontent.com/${repo.owner}?s=460`
    const langColor = repo.language ? LANGUAGE_COLORS[repo.language] ?? "#6b7280" : null
    const hasAttributes = repo.attributes && Object.values(repo.attributes).some(v => v > 0)

    const handleDownload = useCallback(async () => {
        if (!cardRef.current) return
        try {
            // Pre-fetch avatar as base64 to avoid CORS issues during export
            const imgs = cardRef.current.querySelectorAll("img")
            const origSrcs: string[] = []
            await Promise.all(Array.from(imgs).map(async (img, i) => {
                origSrcs[i] = img.src
                if (img.src.startsWith("http")) {
                    try {
                        const resp = await fetch(img.src)
                        const blob = await resp.blob()
                        const dataUrl = await new Promise<string>((resolve) => {
                            const reader = new FileReader()
                            reader.onloadend = () => resolve(reader.result as string)
                            reader.readAsDataURL(blob)
                        })
                        img.src = dataUrl
                    } catch {
                        // Keep original src if fetch fails
                    }
                }
            }))

            const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
            const link = document.createElement("a")
            link.download = `${repo.name.replace("/", "-")}-stats.png`
            link.href = dataUrl
            link.click()

            // Restore original srcs
            imgs.forEach((img, i) => { img.src = origSrcs[i] })
        } catch (err) {
            console.error("Failed to export card as PNG:", err)
        }
    }, [repo.name])

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
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:site_name" content="Star History" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={canonicalUrl} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={ogImage} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareSourceCode",
                        "name": repo.name,
                        "description": repo.description || undefined,
                        "codeRepository": `https://github.com/${repo.name}`,
                        "programmingLanguage": repo.language || undefined,
                        "license": repo.license || undefined,
                        "dateCreated": repo.created_at || undefined,
                        "url": canonicalUrl,
                        "interactionStatistic": [
                            {
                                "@type": "InteractionCounter",
                                "interactionType": "https://schema.org/LikeAction",
                                "userInteractionCount": repo.stars_total,
                            },
                            {
                                "@type": "InteractionCounter",
                                "interactionType": "https://schema.org/ForkAction",
                                "userInteractionCount": repo.forks_count,
                            },
                        ],
                    }) }}
                />
            </Head>
            <PageShell>
                <Toolbar onDownload={handleDownload} tweetUrl={tweetUrl} />

                <div ref={cardRef} className="relative w-full max-w-5xl aspect-video flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden px-12 py-10" style={{ fontFamily: '"xkcd", cursive' }}>
                    {/* Rank stamp */}
                    {repo.rank > 0 && (
                        <div className="absolute top-6 right-10 -rotate-12 z-10 w-[110px] h-[110px] rounded-full border-[3px] border-red-600 opacity-80 flex flex-col items-center justify-center text-red-600">
                            <span className="text-[9px] uppercase tracking-widest">Global Rank</span>
                            <span className="text-[28px] font-bold leading-none">#{repo.rank}</span>
                            {repo.total_repos > 0 && (
                                <span className="text-[8px] mt-0.5">of {formatNumber(repo.total_repos)}</span>
                            )}
                        </div>
                    )}

                    {/* Main row: left info + right radar */}
                    <div className="flex flex-1 gap-8 min-h-0">
                        {/* Left column */}
                        <div className="flex flex-col flex-1 min-w-0">
                            {/* Avatar + name row */}
                            <div className="flex items-start">
                                <div className="relative w-[120px] h-[120px] shrink-0">
                                    <img
                                        src={avatarUrl}
                                        alt={repo.owner}
                                        className="w-[120px] h-[120px] rounded-[14px]"
                                        loading="lazy"
                                    />
                                    <svg className="absolute -inset-1 w-[128px] h-[128px]" viewBox="0 0 100 100" fill="none" stroke="#525252" strokeWidth="1.2" strokeLinecap="round">
                                        <path d="M10,3 C25,1 75,2 90,4 C96,9 98,25 97,50 C98,75 96,91 91,96 C75,98 25,99 9,96 C3,91 2,75 3,50 C2,25 4,9 10,3 Z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col ml-6 flex-1 min-w-0">
                                    <h1 className="flex items-baseline text-[34px] font-bold leading-tight">
                                        <span className="text-neutral-400 font-normal">{repo.owner}</span>
                                        <span className="text-neutral-300 mx-1">/</span>
                                        <span className="text-neutral-900">{repoShortName}</span>
                                    </h1>
                                    {repo.description && (
                                        <p className="text-xl text-neutral-600 mt-3.5 leading-relaxed">
                                            {repo.description.length > 120 ? repo.description.slice(0, 117) + "..." : repo.description}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4 mt-3.5 text-lg text-neutral-500">
                                        {repo.language && (
                                            <span className="flex items-center gap-1.5">
                                                {langColor && <span className="w-[11px] h-[11px] rounded-full inline-block" style={{ backgroundColor: langColor }} />}
                                                {repo.language}
                                            </span>
                                        )}
                                        {repo.license && <span>{repo.license}</span>}
                                        {repo.created_at && (
                                            <span className="text-neutral-400">since {formatDate(repo.created_at)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Large stats — pushed to bottom */}
                            <div className="flex items-baseline gap-10 mt-auto pt-6">
                                <div className="flex flex-col">
                                    <span className="text-[44px] font-bold text-neutral-900 leading-none flex items-center gap-2">
                                        <SketchStarIcon size={36} />{formatNumber(repo.stars_total)}
                                    </span>
                                    <span className="text-lg text-neutral-500 mt-0.5">stars</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[44px] font-bold text-neutral-600 leading-none flex items-center gap-2">
                                        <SketchForkIcon size={36} />{formatNumber(repo.forks_count)}
                                    </span>
                                    <span className="text-lg text-neutral-500 mt-0.5">forks</span>
                                </div>
                            </div>

                            {/* Attribute bars */}
                            {hasAttributes && (
                                <div className="mt-4">
                                    <AttributeBars repo={repo} />
                                </div>
                            )}
                        </div>

                        {/* Right column: radar chart */}
                        {hasAttributes && (
                            <div className="flex items-center justify-center w-[380px] shrink-0">
                                <div className="w-[360px] h-[360px]">
                                    <RadarChart attributes={repo.attributes} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end items-center gap-2 mt-3">
                        <Link href="/" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                            <img src="/assets/logo-icon.png" alt="" className="h-5 w-5" />
                            <span className="text-base text-neutral-400">star-history.com</span>
                        </Link>
                    </div>
                </div>
                {repo.name.toLowerCase() === "openclaw/openclaw" && (
                    <div className="relative w-full max-w-5xl h-16 mt-4">
                        <img
                            src="/assets/lobster-animated.gif"
                            alt="🦞"
                            width={64}
                            height={64}
                            className="absolute top-0 left-0 lobster-walk"
                        />
                    </div>
                )}
                <p className="text-sm text-neutral-400 mt-3" style={{ fontFamily: '"xkcd", cursive' }}>
                    Tracking repos with {formatNumber(minStars)}+ stars
                </p>
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
    const { repos: cards, min_stars } = loadRepoCards()

    const slug = params?.slug
    if (!Array.isArray(slug) || slug.length !== 2) {
        return { notFound: true }
    }

    const fullName = slug.join("/")
    const cardData = cards.find((c) => c.name.toLowerCase() === fullName.toLowerCase())

    if (cardData) {
        return { props: { repo: cardData, minStars: min_stars } }
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
            minStars: min_stars,
        },
    }
}

export default RepoPage
