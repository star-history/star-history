import React from "react"
import Header from "../components/header"
import Footer from "../components/footer"
import { AppStateProvider } from "../store"
import StarChartViewer from "../components/StarChartViewer"
import Head from "next/head"
import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import fs from "fs"
import path from "path"

interface RepoPageProps {
    repo: {
        name: string
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
    }
}

function formatNumber(n: number): string {
    if (n >= 1000) {
        return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k"
    }
    return n.toString()
}

const RepoPage: NextPage<RepoPageProps> = ({ repo }) => {
    const title = `${repo.name} Star History`
    const description = repo.description
        ? `Star history and stats for ${repo.name}: ${repo.description}`
        : `View the star history chart for ${repo.name} on GitHub.`
    const canonicalUrl = `https://star-history.com/${repo.name.toLowerCase()}`
    const ogImage = `https://api.star-history.com/svg?repos=${repo.name}&type=Date`

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
            <section>
                <AppStateProvider initialRepos={[repo.name]}>
                    <div className="relative w-full h-auto min-h-screen flex flex-col">
                        <Header />
                        <div className="w-full max-w-4xl mx-auto px-4 flex flex-col grow">
                            <StarChartViewer />

                            <div className="mt-8 mb-12 p-6 border border-gray-200 rounded-lg">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {repo.name}
                                    {repo.archived && (
                                        <span className="ml-2 text-sm font-normal text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">
                                            archived
                                        </span>
                                    )}
                                </h1>
                                {repo.description && (
                                    <p className="text-gray-600 mb-4">{repo.description}</p>
                                )}

                                <a
                                    href={`https://github.com/${repo.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors mb-5"
                                >
                                    <i className="fab fa-github"></i>
                                    View on GitHub
                                </a>

                                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600 mb-4">
                                    <span title="Stars">
                                        <i className="fas fa-star text-yellow-500 mr-1"></i>
                                        {formatNumber(repo.stars_total)}
                                    </span>
                                    <span title="Forks">
                                        <i className="fas fa-code-branch text-gray-400 mr-1"></i>
                                        {formatNumber(repo.forks_count)}
                                    </span>
                                    {repo.language && (
                                        <span title="Language">
                                            <i className="fas fa-circle text-blue-400 mr-1 text-xs"></i>
                                            {repo.language}
                                        </span>
                                    )}
                                    {repo.license && (
                                        <span title="License">
                                            <i className="fas fa-balance-scale text-gray-400 mr-1"></i>
                                            {repo.license}
                                        </span>
                                    )}
                                    <span title="Open issues">
                                        <i className="fas fa-exclamation-circle text-green-500 mr-1"></i>
                                        {formatNumber(repo.open_issues_count)} issues
                                    </span>
                                    {repo.created_at && (
                                        <span title="Created">
                                            <i className="fas fa-calendar text-gray-400 mr-1"></i>
                                            {new Date(repo.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    )}
                                </div>

                                {repo.topics.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {repo.topics.map((topic) => (
                                            <span
                                                key={topic}
                                                className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                                            >
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {repo.homepage && (
                                    <a
                                        href={repo.homepage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        <i className="fas fa-external-link-alt mr-1"></i>
                                        {repo.homepage}
                                    </a>
                                )}
                            </div>
                        </div>
                        <Footer />
                    </div>
                </AppStateProvider>
            </section>
        </>
    )
}

interface RepoRow {
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

function loadRepos(): RepoRow[] {
    try {
        const filePath = path.join(process.cwd(), "helpers", "repos.json")
        return JSON.parse(fs.readFileSync(filePath, "utf-8"))
    } catch {
        return []
    }
}

export const getStaticPaths: GetStaticPaths = async () => {
    const repos = loadRepos()
    const paths = repos.map((repo) => ({
        params: { slug: repo.name.toLowerCase().split("/") },
    }))
    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<RepoPageProps> = async ({ params }) => {
    const slug = params?.slug
    if (!Array.isArray(slug) || slug.length !== 2) {
        return { notFound: true }
    }

    const fullName = slug.join("/")
    const repos = loadRepos()
    const repoData = repos.find((r) => r.name.toLowerCase() === fullName.toLowerCase())

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
            },
        },
    }
}

export default RepoPage
