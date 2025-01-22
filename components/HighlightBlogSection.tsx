import React from "react"
import Link from "next/link"

interface BlogLink {
    title: string
    path: string
}

interface BlogSection {
    title: string
    linkList: BlogLink[]
}

interface HighlightBlogSectionProps {
    blogSectionList: BlogSection[]
}

const blogSectionList: BlogSection[] = [
    {
        title: "Playbook",
        linkList: [
            {
                title: "📕 How to Use this Site",
                path: "/blog/how-to-use-github-star-history"
            },
            {
                title: "⭐️ How to Get More Stars",
                path: "/blog/playbook-for-more-github-stars"
            }
        ]
    },
    {
        title: "Monthly Pick",
        linkList: [
            {
                title: "2024 Dec (AI Data Visualization)",
                path: "/blog/ai-data-visualization",
            },
            {
                title: "2024 Nov (AI DevTools)",
                path: "/blog/ai-devtools",
            },
            {
                title: "2024 Oct (Homelab)",
                path: "/blog/homelab",
            },
            {
                title: "2024 Sep (AI Agents)",
                path: "/blog/ai-agents",
            },
            {
                title: "2024 Aug (RAG frameworks)",
                path: "/blog/rag-frameworks",
            },
            {
                title: "2024 Jul (AI Generators)",
                path: "/blog/ai-generators",
            },
            {
                title: "2024 Jun (AI Searches)",
                path: "/blog/ai-search",
            },
            {
                title: "2024 May (AI Web Scraper)",
                path: "/blog/ai-web-scraper",
            },
            {
                title: "2024 Apr (AI Prompt)",
                path: "/blog/prompt-engineering",
            },
            {
                title: "2024 Mar (Non-AI)",
                path: "/blog/non-ai",
            },
            {
                title: "2024 Feb (Most Underrated)",
                path: "/blog/most-underrated",
            },
            {
                title: "2024 Jan (Text2SQL)",
                path: "/blog/text2sql"
            },
            {
                title: "2023 Dec (GPT Wrappers)",
                path: "/blog/gpt-wrappers"
            },
            {
                title: "2023 Nov (TTS)",
                path: "/blog/tts"
            },
            {
                title: "2023 Oct (AI for Postgres)",
                path: "/blog/ai-for-postgres"
            },
            {
                title: "2023 Sept (Coding AI)",
                path: "/blog/coding-ai"
            },
            {
                title: "2023 Aug (CLI tool for LLMs)",
                path: "/blog/cli-tool-for-llm"
            },
            {
                title: "2023 July (Llama 2 Edition)",
                path: "/blog/llama2"
            },
            {
                title: "2023 June",
                path: "/blog/star-history-monthly-pick-202306"
            },
            {
                title: "2023 May",
                path: "/blog/star-history-monthly-pick-202305"
            },
            {
                title: "2023 Apr",
                path: "/blog/star-history-monthly-pick-202304"
            },
            {
                title: "2023 Mar (ChatGPT Edition)",
                path: "/blog/star-history-monthly-pick-202303"
            },
            {
                title: "2023 Feb",
                path: "/blog/star-history-monthly-pick-202302"
            },
            {
                title: "2023 Jan",
                path: "/blog/star-history-monthly-pick-202301"
            },
            {
                title: "2022 Dec",
                path: "/blog/star-history-monthly-pick-202212"
            }
        ]
    },
    {
        title: "Yearly Pick",
        linkList: [
            {
                title: "2024",
                path: "/blog/best-of-2024",
            },
            {
                title: "2023",
                path: "/blog/best-of-2023",
            },
            {
                title: "2022 Data, Infra & DevTools",
                path: "/blog/star-history-yearly-pick-2022-data-infra-devtools"
            },
            {
                title: "2022 Platform Engineering",
                path: "/blog/star-history-open-source-2022-platform-engineering"
            },
            {
                title: "2022 OSS Alternatives",
                path: "/blog/star-history-open-source-2022-open-source-alternatives"
            },
            {
                title: "2022 Front-end",
                path: "/blog/star-history-yearly-pick-2022-frontend"
            }
        ]
    },
    {
        title: "Starlet List",
        linkList: [
            {
                title: "🎁 Prompt yours for FREE",
                path: "/blog/list-your-open-source-project"
            },
            {
                title: "Issue #28 - Trench",
                path: "/blog/trench",
            },
            {
                title: "Issue #27 - langfuse",
                path: "/blog/langfuse",
            },
            {
                title: "Issue #26 - thepi.pe",
                path: "/blog/thepipe",
            },
            {
                title: "Issue #25 - Taipy",
                path: "/blog/taipy",
            },
            {
                title: "Issue #24 - Superlinked",
                path: "/blog/superlinked",
            },
            {
                title: "Issue #23 - tea-tasting",
                path: "/blog/tea-tasting",
            },
            {
                title: "Issue #22 - Giskard",
                path: "/blog/giskard",
            },
            {
                title: "Issue #21 - Khoj",
                path: "/blog/khoj",
            },
            {
                title: "Issue #20 - ParadeDB",
                path: "/blog/paradedb",
            },
            {
                title: "Issue #19 - Skyvern",
                path: "/blog/skyvern",
            },
            {
                title: "Issue #18 - Prisma",
                path: "/blog/prisma",
            },
            {
                title: "Issue #17 - SpiceDB",
                path: "/blog/spicedb",
            },
            {
                title: "Issue #16 - Apache Answer",
                path: "/blog/answer",
            },
            {
                title: "Issue #15 - Infinity",
                path: "/blog/infinity",
            },
            {
                title: "Issue #14 - Proton",
                path: "/blog/proton"
            },
            {
                title: "Issue #13 - Earthly",
                path: "/blog/earthly"
            },
            {
                title: "Issue #12 - Wasp",
                path: "/blog/wasp"
            },
            {
                title: "Issue #11 - libSQL",
                path: "/blog/libsql"
            },
            {
                title: "Issue #10 - PostgresML",
                path: "/blog/postgresml"
            },
            {
                title: "Issue #9 - ElectricSQL",
                path: "/blog/electricsql"
            },
            {
                title: "Issue #8 - Prompt flow",
                path: "/blog/prompt-flow"
            },
            {
                title: "Issue #7 - Clipboard",
                path: "/blog/clipboard"
            },
            {
                title: "Issue #6 - Hoppscotch",
                path: "/blog/hoppscotch"
            },
            {
                title: "Issue #5 - MetisFL",
                path: "/blog/metisfl"
            },
            {
                title: "Issue #4 - chatgpt.js",
                path: "/blog/chatgpt-js"
            },
            {
                title: "Issue #3 - Mockoon",
                path: "/blog/mockoon"
            },
            {
                title: "Issue #2 - DLTA-AI",
                path: "/blog/dlta-ai"
            },
            {
                title: "Issue #1 - Sniffnet",
                path: "/blog/sniffnet"
            }
        ]
    }
]

const HighlightBlogSection: React.FC<Omit<HighlightBlogSectionProps, "blogSectionList">> = () => {
    return (
        <div className="flex flex-col justify-start items-start w-full mt-2 p-4 pl-8">
            <Link href="/blog/list-your-open-source-project" className="hover:opacity-75">
                <img className="w-auto max-w-full" src="/assets/starlet-icon.webp" />
            </Link>
            {blogSectionList.map((section) => (
                <div key={section.title}>
                    <div className="w-full flex flex-row justify-between items-center my-2">
                        <h3 className="text-sm font-medium text-gray-400 leading-6">{section.title}</h3>
                    </div>
                    <ul className="list-disc list-inside">
                        {section.linkList.map((blog) => (
                            <li key={blog.title} className="mb-2 leading-3">
                                <Link href={blog.path} className="cursor-pointer" rel="noopener noreferrer">
                                    <span className="inline -ml-2 text-sm text-blue-700 hover:underline">{blog.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}
export default HighlightBlogSection
