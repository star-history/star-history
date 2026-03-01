/* eslint-disable @next/next/no-img-element */
import Head from "next/head"
import Link from "next/link"
import { createElement, useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { toPng } from "html-to-image"
import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { formatNumber } from "../helpers/format"
import { loadRepos } from "@shared/common/repo-data"
import type { RepoCardData } from "@shared/types/gh"
import PageShell from "../components/PageShell"
import InteractiveRadar from "../components/InteractiveRadar"
import { buildLandscape1 } from "@shared/packages/card-landscape1"
import { renderRadarSvg } from "@shared/packages/radar-svg"

// --- VDOM-to-React conversion (buildLandscape1 returns a Satori-compatible VDOM tree) ---

const SVG_ATTRS: Record<string, string> = {
    "stroke-width": "strokeWidth",
    "stroke-linecap": "strokeLinecap",
    "stroke-linejoin": "strokeLinejoin",
    "stroke-dasharray": "strokeDasharray",
    "fill-opacity": "fillOpacity",
    "text-anchor": "textAnchor",
    "dominant-baseline": "dominantBaseline",
    "clip-path": "clipPath",
    "clip-rule": "clipRule",
}

const SVG_TAGS = new Set(["svg", "path", "circle", "rect", "line", "text", "g", "image", "clipPath", "defs"])

function vnodeToReact(node: any, key?: number): ReactNode {
    if (node == null || typeof node === "boolean") return null
    if (typeof node === "string" || typeof node === "number") return node
    if (!node.type) return null
    const { children, ...attrs } = node.props || {}
    if (SVG_TAGS.has(node.type)) {
        for (const k of Object.keys(attrs)) {
            if (SVG_ATTRS[k]) { attrs[SVG_ATTRS[k]] = attrs[k]; delete attrs[k] }
        }
    }
    if (key !== undefined) attrs.key = key
    const kids = children == null ? [] : Array.isArray(children) ? children : [children]
    return createElement(node.type, attrs, ...kids.map((c: any, i: number) => vnodeToReact(c, i)))
}

// --- Page ---

interface NavRepo {
    name: string
    rank: number
}

interface RepoPageProps {
    repo: RepoCardData
    minStars: number
    prevRepo: NavRepo | null
    nextRepo: NavRepo | null
}

const Toolbar = ({ onDownload, downloading, tweetUrl }: { onDownload: () => void; downloading: boolean; tweetUrl: string }) => (
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
            {downloading && (
                <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
            )}
            <button
                onClick={onDownload}
                disabled={downloading}
                className="text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-40"
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
                className="btn-secondary"
            >
                <i className="fab fa-x-twitter"></i> Share
            </a>
        </div>
    </div>
)

const RepoPage: NextPage<RepoPageProps> = ({ repo, minStars, prevRepo, nextRepo }) => {
    const cardRef = useRef<HTMLDivElement>(null)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const [scale, setScale] = useState(1)
    const [downloading, setDownloading] = useState(false)
    const [radarPos, setRadarPos] = useState<{ left: number; top: number; width: number; height: number } | null>(null)
    const [statTooltip, setStatTooltip] = useState<{ left: number; top: number; line1: string; line2: string } | null>(null)

    const title = `${repo.name} - ${formatNumber(repo.stars_total)} Stars`
    const weeklyParts = [
        repo.attributes?.new_stars ? `+${formatNumber(repo.attributes.new_stars)} stars` : "",
        repo.attributes?.pushes ? `${formatNumber(repo.attributes.pushes)} pushes` : "",
        repo.attributes?.contributors ? `${formatNumber(repo.attributes.contributors)} contributors` : "",
    ].filter(Boolean)
    const description = weeklyParts.length ? `This week: ${weeklyParts.join(", ")}` : `Star history and stats for ${repo.name}`
    const canonicalUrl = `https://star-history.com/${repo.name.toLowerCase()}`
    const ogImage = `https://api.star-history.com/svg?repos=${repo.name}&style=landscape1`
    const tweetText = `${repo.name} - ${formatNumber(repo.stars_total)} stars on GitHub`
    const tweetUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(canonicalUrl)}&text=${encodeURIComponent(tweetText)}`

    const hasAttributes = repo.attributes && Object.values(repo.attributes).some(v => v > 0)

    // Build radar SVG as data-URL (same as backend og-card.ts)
    const radarSvgBase64 = useMemo(() => {
        if (!hasAttributes) return null
        const svg = renderRadarSvg(repo.attributes, 400)
        return `data:image/svg+xml;base64,${btoa(svg)}`
    }, [repo.attributes, hasAttributes])

    // Build the shared VDOM layout — same code path as the /svg?style=landscape1 endpoint
    const cardVNode = useMemo(() => buildLandscape1({
        name: repo.name,
        description: repo.description,
        stars: repo.stars_total,
        forks: repo.forks_count,
        language: repo.language,
        license: repo.license,
        created_at: repo.created_at,
        avatarBase64: `https://avatars.githubusercontent.com/${repo.owner}?s=460`,
        radarSvgBase64,
        attributes: hasAttributes ? repo.attributes : null,
        rank: repo.rank,
        logoBase64: "/assets/logo-icon.png",
    }), [repo, radarSvgBase64, hasAttributes])

    // Scale the native 1200×630 card to fit the container
    useEffect(() => {
        const el = wrapperRef.current
        if (!el) return
        const update = () => setScale(el.clientWidth / 1200)
        update()
        const observer = new ResizeObserver(() => update())
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    // Compute radar image position within the card (in native 1200×630 coordinates)
    useEffect(() => {
        const card = cardRef.current
        if (!card || !hasAttributes) return
        const img = card.querySelector('img[width="560"]') as HTMLElement | null
        if (!img) return
        const cardRect = card.getBoundingClientRect()
        const imgRect = img.getBoundingClientRect()
        const s = cardRect.width / 1200
        setRadarPos({
            left: (imgRect.left - cardRect.left) / s,
            top: (imgRect.top - cardRect.top) / s,
            width: imgRect.width / s,
            height: imgRect.height / s,
        })
    }, [scale, hasAttributes])

    // Show xkcd-style tooltip on stat elements that have a title attribute
    useEffect(() => {
        const card = cardRef.current
        if (!card) return

        let activeEl: HTMLElement | null = null
        let originalTitle = ""

        const restore = () => {
            if (activeEl && originalTitle) {
                activeEl.setAttribute("title", originalTitle)
            }
            activeEl = null
            originalTitle = ""
        }

        const handleOver = (e: MouseEvent) => {
            // Still inside the active element (title already removed, so closest won't find it)
            if (activeEl && activeEl.contains(e.target as Node)) return

            const el = (e.target as HTMLElement).closest?.("[title]") as HTMLElement | null

            restore()

            if (!el) {
                setStatTooltip(null)
                return
            }

            const title = el.getAttribute("title")!
            const parts = title.split(" \u00b7 ")
            if (parts.length !== 2) return

            activeEl = el
            originalTitle = title
            el.removeAttribute("title")

            const cardRect = card.getBoundingClientRect()
            const elRect = el.getBoundingClientRect()
            const s = cardRect.width / 1200

            setStatTooltip({
                left: (elRect.left + elRect.width / 2 - cardRect.left) / s,
                top: (elRect.top - cardRect.top) / s,
                line1: parts[0],
                line2: parts[1],
            })
        }

        const handleOut = (e: MouseEvent) => {
            if (!activeEl) return
            const related = e.relatedTarget as Node | null
            if (related && activeEl.contains(related)) return
            restore()
            setStatTooltip(null)
        }

        card.addEventListener("mouseover", handleOver)
        card.addEventListener("mouseout", handleOut)
        return () => {
            card.removeEventListener("mouseover", handleOver)
            card.removeEventListener("mouseout", handleOut)
            restore()
        }
    }, [])

    const handleDownload = useCallback(async () => {
        if (!cardRef.current || downloading) return
        setDownloading(true)
        try {
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

            // Capture at native 1200×630 without modifying the DOM
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                width: 1200,
                height: 630,
                style: { transform: "none" },
                filter: (node) => !(node instanceof HTMLElement && node.hasAttribute("data-html2image-ignore")),
            })

            // Restore image srcs
            imgs.forEach((img, i) => { img.src = origSrcs[i] })

            const link = document.createElement("a")
            link.download = `${repo.name.replace("/", "-")}-stats.png`
            link.href = dataUrl
            link.click()
        } catch (err) {
            console.error("Failed to export card as PNG:", err)
        } finally {
            setDownloading(false)
        }
    }, [repo.name, downloading])

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:locale" content="en_US" />
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
            <PageShell header={
                <Link href="/">
                    <img src="/assets/logo-full.svg" alt="Star History" className="h-8 mb-4" />
                </Link>
            }>
                <Toolbar onDownload={handleDownload} downloading={downloading} tweetUrl={tweetUrl} />

                <div
                    ref={wrapperRef}
                    className="w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden [&_[data-repo-name]]:cursor-pointer [&_[data-repo-name]:hover]:underline"
                    style={{ aspectRatio: "1200/630" }}
                    onClick={(e) => {
                        const target = (e.target as HTMLElement).closest?.("[data-repo-name]")
                        if (target) window.open(`https://github.com/${repo.name}`, "_blank", "noopener")
                    }}
                >
                    <div ref={cardRef} style={{ width: 1200, height: 630, transform: `scale(${scale})`, transformOrigin: "top left", position: "relative" }}>
                        {vnodeToReact(cardVNode)}
                        {hasAttributes && radarPos && (
                            <div
                                data-html2image-ignore=""
                                style={{
                                    position: "absolute",
                                    left: radarPos.left,
                                    top: radarPos.top,
                                    width: radarPos.width,
                                    height: radarPos.height,
                                    pointerEvents: "none",
                                }}
                            >
                                <InteractiveRadar
                                    attributes={repo.attributes}
                                    rawValues={{
                                        stars: formatNumber(repo.stars_total),
                                        forks: formatNumber(repo.forks_count),
                                    }}
                                />
                            </div>
                        )}
                        {statTooltip && (
                            <div
                                data-html2image-ignore=""
                                style={{
                                    position: "absolute",
                                    left: statTooltip.left,
                                    top: statTooltip.top,
                                    transform: "translate(-50%, -100%) translateY(-12px)",
                                    pointerEvents: "none",
                                    zIndex: 10,
                                }}
                            >
                                <svg width="200" height="60" style={{ margin: "-5px" }}>
                                    <defs>
                                        <filter id="xkcdify-tip-stat" x="-5%" y="-5%" width="110%" height="110%">
                                            <feTurbulence type="fractalNoise" baseFrequency="0.05" result="noise" />
                                            <feDisplacementMap scale="5" xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" in2="noise" />
                                        </filter>
                                    </defs>
                                    <rect x="5" y="5" width="190" height="50" fill="white" fillOpacity={0.9} stroke="black" strokeWidth={2} rx={5} ry={5} filter="url(#xkcdify-tip-stat)" />
                                    <rect x="15" y="16" width="8" height="8" fill="#16a34a" rx={2} ry={2} />
                                    <text x="27" y="24" fontSize="15px" fontWeight="bold" fill="black" style={{ fontFamily: '"xkcd", cursive' }}>
                                        {statTooltip.line1}
                                    </text>
                                    <text x="15" y="44" fontSize="15px" fill="black" style={{ fontFamily: '"xkcd", cursive' }}>
                                        {statTooltip.line2}
                                    </text>
                                </svg>
                            </div>
                        )}
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

                <div className="flex items-center justify-between w-full max-w-5xl mt-3 text-sm text-neutral-400" style={{ fontFamily: '"xkcd", cursive' }}>
                    <div className="w-1/3">
                        {prevRepo && (
                            <Link href={`/${prevRepo.name.toLowerCase()}`} className="inline-flex items-center gap-1.5 hover:text-neutral-600 transition-colors">
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.5 13L5.5 8L10.5 3" />
                                </svg>
                                <span>#{prevRepo.rank} {prevRepo.name.split("/")[1]}</span>
                            </Link>
                        )}
                    </div>
                    <div className="w-1/3 text-center">
                        #{repo.rank} of {formatNumber(repo.total_repos)}
                    </div>
                    <div className="w-1/3 text-right">
                        {nextRepo && (
                            <Link href={`/${nextRepo.name.toLowerCase()}`} className="inline-flex items-center gap-1.5 hover:text-neutral-600 transition-colors justify-end">
                                <span>{nextRepo.name.split("/")[1]} #{nextRepo.rank}</span>
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5.5 3L10.5 8L5.5 13" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>

                <p className="text-sm text-neutral-400 mt-1">
                    Tracking repos with {formatNumber(minStars)}+ stars
                </p>
            </PageShell>
        </>
    )
}

// --- Data loading ---

export const getStaticPaths: GetStaticPaths = async () => {
    const { repos } = loadRepos()

    const paths = repos.map((repo) => ({
        params: { slug: repo.name.toLowerCase().split("/") },
    }))

    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<RepoPageProps> = async ({ params }) => {
    const store = loadRepos()

    const slug = params?.slug
    if (!Array.isArray(slug) || slug.length !== 2) {
        return { notFound: true }
    }

    const repo = store.getRepo(slug.join("/"))

    if (!repo) {
        return { notFound: true }
    }

    const idx = store.repos.findIndex(r => r.name.toLowerCase() === slug.join("/").toLowerCase())
    const prev = idx > 0 ? store.repos[idx - 1] : null
    const next = idx >= 0 && idx < store.repos.length - 1 ? store.repos[idx + 1] : null

    return {
        props: {
            repo,
            minStars: store.min_stars,
            prevRepo: prev ? { name: prev.name, rank: prev.rank } : null,
            nextRepo: next ? { name: next.name, rank: next.rank } : null,
        },
    }
}

export default RepoPage
