/* eslint-disable @next/next/no-img-element */
import Head from "next/head"
import Link from "next/link"
import { useCallback, useRef, useState } from "react"
import { toPng } from "html-to-image"
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
    minStars: number
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

const AttributeBars = ({ repo, compact }: { repo: RepoCardData; compact?: boolean }) => (
    <div className={`grid px-1 ${compact ? "grid-cols-3 gap-x-4 gap-y-2" : "grid-cols-2 gap-x-6 gap-y-5"}`}>
        {ATTRIBUTE_LABELS.map(({ key, label }, i) => {
            const value = repo.attributes[key];
            const pct = Math.min(value, 100);
            const w = pct * 1.94;
            return (
                <div key={key} className={`flex items-center ${compact ? "gap-2" : "gap-3"}`} style={{ transform: `rotate(${XKCD_ROTATIONS[i % XKCD_ROTATIONS.length]}deg)` }}>
                    <span className={`text-neutral-500 text-right shrink-0 ${compact ? "text-xs w-20" : "text-base w-28"}`}>{label}</span>
                    <div className={`flex-1 ${compact ? "h-6" : "h-10"}`}>
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
                    <span className={`text-neutral-400 shrink-0 ${compact ? "text-xs w-7" : "text-base w-9"}`}>{value}</span>
                </div>
            );
        })}
    </div>
)

const LayoutToggle = ({ mode, onChange, wide, onDownload, tweetUrl }: { mode: LayoutMode; onChange: (m: LayoutMode) => void; wide: boolean; onDownload: () => void; tweetUrl: string }) => (
    <div className={`flex items-center mb-2 w-full ${wide ? "max-w-5xl" : "max-w-2xl"}`} style={{ fontFamily: '"xkcd", cursive' }}>
        <div className="flex-1">
            <Link href="/" className="inline-flex items-center gap-1.5 text-lg text-neutral-400 hover:text-neutral-600 transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.5 13L5.5 8L10.5 3" />
                </svg>
                Back to home
            </Link>
        </div>
        <div className="inline-flex rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
            <button
                onClick={() => onChange("landscape")}
                className={`px-2.5 py-1.5 transition-colors ${
                    mode === "landscape" ? "bg-neutral-800 text-white" : "text-neutral-500 hover:bg-neutral-50"
                }`}
                title="Landscape"
            >
                <svg width="20" height="15" viewBox="0 0 24 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5,2 C8,1.5 16,2.5 21.5,1.8 C22.5,2.5 22.2,5 22.5,9 C22.2,13 22.8,15 21.5,15.8 C16,16.5 8,15.5 2.5,16 C1.5,15 1.8,12 1.5,9 C1.8,5 1.2,3 2.5,2 Z" />
                </svg>
            </button>
            <button
                onClick={() => onChange("portrait")}
                className={`px-2.5 py-1.5 transition-colors ${
                    mode === "portrait" ? "bg-neutral-800 text-white" : "text-neutral-500 hover:bg-neutral-50"
                }`}
                title="Portrait"
            >
                <svg width="13" height="18" viewBox="0 0 16 22" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5,2 C5,1.5 11,2.5 13.5,1.8 C14.5,2.5 14.2,7 14.5,11 C14.2,15 14.8,18 13.5,19.8 C11,20.5 5,19.5 2.5,20 C1.5,19 1.8,15 1.5,11 C1.8,7 1.2,3 2.5,2 Z" />
                </svg>
            </button>
        </div>
        <div className="flex-1 flex justify-end self-end gap-3">
            <a
                href={tweetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                title="Share on X"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
            </a>
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
        </div>
    </div>
)

const RepoPage: NextPage<RepoPageProps> = ({ repo, minStars }) => {
    const [layout, setLayout] = useState<LayoutMode>("landscape")
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
    const ogImage = `https://api.star-history.com/svg?repos=${repo.name}&type=Date&style=card`
    const tweetText = `${repo.name} - ${formatNumber(repo.stars_total)} stars on GitHub`
    const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(tweetText)}`
    const langColor = repo.language ? LANGUAGE_COLORS[repo.language] ?? "#6b7280" : null
    const repoShortName = repo.name.split("/")[1]
    const avatarUrl = `https://avatars.githubusercontent.com/${repo.owner}?s=460`
    const hasAttributes = repo.attributes && Object.values(repo.attributes).some(v => v > 0)
    const isLandscape = layout === "landscape"

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
                <LayoutToggle mode={layout} onChange={setLayout} wide={isLandscape} onDownload={handleDownload} tweetUrl={tweetUrl} />

                {isLandscape ? (
                    /* ── Landscape layout ── */
                    <div ref={cardRef} className="relative w-full max-w-5xl aspect-video flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden" style={{ fontFamily: '"xkcd", cursive' }}>
                        {/* Rank stamp overlay */}
                        {repo.rank > 0 && (
                            <div className="absolute top-3 right-5 -rotate-12 z-10 w-[120px] h-[120px] opacity-80">
                                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120" fill="none" stroke="#dc2626" strokeWidth="3">
                                    <circle cx="60" cy="60" r="57" />
                                    <circle cx="60" cy="60" r="51" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-600 font-bold">
                                    <span className="text-[9px] uppercase tracking-widest">Global Rank</span>
                                    <span className="text-2xl leading-none">#{repo.rank}</span>
                                    <span className="text-[8px] font-normal tracking-wide mt-0.5">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                </div>
                            </div>
                        )}
                        {/* Header bar: stats */}
                        <div className="flex items-center px-5 pt-4 pb-2 text-sm text-neutral-500">
                            <div className="flex items-center gap-5 whitespace-nowrap">
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
                        </div>

                        {/* ID card + Radar */}
                        <div className="flex flex-col md:flex-row px-4 pb-2 flex-1 min-h-0 justify-center gap-10">
                            {/* ID card */}
                            <div className="flex items-center pt-12">
                                <div className="w-full flex flex-col items-center gap-2">
                                    <div className="relative w-full max-w-[180px]">
                                        <svg className="absolute w-0 h-0">
                                            <defs>
                                                <clipPath id="wobbly-rect" clipPathUnits="objectBoundingBox">
                                                    <path d="M0.08,0.02 C0.25,0 0.75,0.01 0.92,0.03 C0.97,0.08 0.99,0.25 0.98,0.5 C0.99,0.75 0.97,0.92 0.93,0.97 C0.75,0.99 0.25,1 0.07,0.97 C0.02,0.92 0.01,0.75 0.02,0.5 C0.01,0.25 0.03,0.08 0.08,0.02 Z" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <img
                                            src={avatarUrl}
                                            alt={repo.owner}
                                            className="w-full aspect-square"
                                            style={{ clipPath: "url(#wobbly-rect)" }}
                                            loading="lazy"
                                        />
                                        <svg className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)]" viewBox="0 0 100 100" fill="none" stroke="#525252" strokeWidth="1.2" strokeLinecap="round">
                                            <path d="M10,3 C25,1 75,2 90,4 C96,9 98,25 97,50 C98,75 96,91 91,96 C75,98 25,99 9,96 C3,91 2,75 3,50 C2,25 4,9 10,3 Z" />
                                        </svg>
                                    </div>
                                    <div className="text-center max-w-[320px]">
                                        <div className="flex items-center justify-center gap-2">
                                            <h1 className="text-2xl font-bold leading-tight">
                                                <span className="text-neutral-400 font-normal">{repo.owner}</span>
                                                <span className="text-neutral-300 mx-0.5">/</span>
                                                <span>{repoShortName}</span>
                                            </h1>
                                            <a href={`https://github.com/${repo.name}`} target="_blank" rel="noopener noreferrer"
                                                className="text-neutral-400 hover:text-neutral-700 transition-colors"
                                            >
                                                <SketchGitHubIcon size={24} />
                                            </a>
                                        </div>
                                        {repo.description && (
                                            <p className="text-base text-neutral-500 mt-2 leading-relaxed line-clamp-2">{repo.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                {hasAttributes && (
                                    <div className="w-[440px]">
                                        <RadarChart attributes={repo.attributes} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom: stat bars + logo */}
                        <div className="px-6 pb-4">
                            {hasAttributes && (
                                <AttributeBars repo={repo} compact />
                            )}
                            <div className="flex justify-end mt-2">
                                <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">
                                    <img src="/assets/logo-full.svg" alt="star-history" className="h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── Portrait layout ── */
                    <div ref={cardRef} className="w-full max-w-2xl aspect-[4/5] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Type bar */}
                        <div className="flex items-center justify-between px-5 py-3 text-xs text-neutral-500" style={{ fontFamily: '"xkcd", cursive' }}>
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
                            <div className="border-t border-neutral-100 px-4 py-4 flex-1 min-h-0" style={{ fontFamily: '"xkcd", cursive' }}>
                                <RadarChart attributes={repo.attributes} />
                                <div className="mt-4">
                                    <AttributeBars repo={repo} />
                                </div>
                            </div>
                        )}

                        {/* Footer stats */}
                        <div className="border-t border-neutral-100 px-5 py-4 mt-auto" style={{ fontFamily: '"xkcd", cursive' }}>
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-5 whitespace-nowrap">
                                    <span className="text-lg text-neutral-800 -rotate-1">
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
                                <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">
                                    <img src="/assets/logo-full.svg" alt="star-history" className="h-5" />
                                </Link>
                            </div>
                        </div>
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
