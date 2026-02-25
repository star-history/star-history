/* eslint-disable @next/next/no-img-element */
import { marked } from "marked"
import matter from "gray-matter"
import Link from "next/link"
import Footer from "../../components/footer"
import Header from "../../components/header"
import SponsorFooterBanner from "../../components/SponsorView"
import RightSidebar from "../../components/RightSidebar"
import TableOfContents, { TocItem } from "../../components/TableOfContents"
import { GetStaticPropsContext, GetStaticPaths } from "next"
import path from "path"
import fs from "fs/promises"
import blogs from "helpers/blog.json"
import { AppStateProvider } from "store"
import Head from "next/head"

interface Blog {
    title: string
    slug: string
    author: string
    description: string
    publishedDate: string
    featureImage?: string
    featured?: boolean
}

interface State {
    blog: Blog
    parsedBlogHTML?: string
    tocItems: TocItem[]
}

// Generate a slug from heading text
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
}

const BlogPost: React.FC<State> = ({ blog, parsedBlogHTML, tocItems }) => {
    return (
        <AppStateProvider>
            <Head>
                <title>{blog ? `${blog.title}` : "GitHub Star History"}</title>
                {
                    blog && (
                        <>
                            {/* Standard Meta Tags */}
                            <meta name="description" content={blog.description} />

                            {/* Open Graph / Facebook */}
                            <meta property="og:type" content="website" />
                            <meta property="og:url" content={`https://star-history.com/blog/${blog.slug}`} />
                            <meta property="og:title" content={blog.title} />
                            <meta property="og:description" content={blog.description} />
                            <meta property="og:image" content={`https://star-history.com${blog.featureImage}`} />

                            {/* Twitter */}
                            <meta name="twitter:card" content="summary_large_image" />
                            <meta name="twitter:url" content={`https://star-history.com/blog/${blog.slug}`} />
                            <meta name="twitter:title" content={blog.title} />
                            <meta name="twitter:description" content={blog.description} />
                            <meta name="twitter:image" content={`https://star-history.com${blog.featureImage}`} />
                        </>
                    )
                }
            </Head>
            <div className="relative w-full h-auto min-h-screen flex flex-col">
                <Header />
                <div className="w-full h-auto grow flex flex-row justify-center">
                    <div className="w-full md:max-w-5xl lg:max-w-7xl px-4 h-auto grow lg:grid lg:grid-cols-[200px_1fr_256px]">
                        <div className="w-full hidden lg:block">
                            <TableOfContents items={tocItems} />
                        </div>
                        {
                            blog == null ? (
                                <div className="w-full h-10 flex flex-col justify-center items-center">
                                <p className="text-center leading-8 text-lg text-dark font-medium">Oops! No article found.</p>
                                <p className="text-center leading-8 text-lg text-dark font-medium">
                                    <Link href="/blog">
                                        <button className="w-full py-2 text-base btn-primary bg-gray-400 hover:bg-gray-500">
                                            <i className="fas fa-chevron-left mr-1"></i>
                                            Back to blog list
                                        </button>
                                    </Link>
                                </p>
                            </div>
                        ) : (
                            <div className="w-full flex flex-col justify-start">
                                <div className="w-full mt-6 h-full flex flex-col justify-start items-center">
                                    <img className="hidden md:block w-full max-w-4xl object-scale-down" src={blog.featureImage || ""} alt="" />
                                    <div className="w-full max-w-4xl mt-8 md:mt-10 justify-center">
                                        <h1 className="text-3xl md:text-4xl leading-snug font-semibold text-dark">{blog.title}</h1>
                                    </div>
                                    <div className="w-full max-w-4xl mt-3 mb-2 flex flex-row items-center text-sm text-gray-500">
                                        <span className="text-gray-700">{blog.author}</span>
                                        <span className="mx-2" aria-hidden="true">&middot;</span>
                                        <time dateTime={blog.publishedDate}>
                                            {new Date(blog.publishedDate).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric"
                                            })}
                                        </time>
                                    </div>
                                    <div className="mt-8 w-full max-w-4xl prose prose-indigo prose-lg" dangerouslySetInnerHTML={{ __html: parsedBlogHTML || "" }} />
                                </div>

                                <SponsorFooterBanner className="mt-16 mb-8" />
                            </div>
                        )
                        }
                        <div className="w-full hidden lg:block">
                            <RightSidebar />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </AppStateProvider>
    )
}

export async function getStaticProps(context: GetStaticPropsContext) {
    let returnObj = {
        props: {
            blog: null as Blog | null,
            parsedBlogHTML: "",
            tocItems: [] as TocItem[]
        }
    }

    try {
        const blogSlug = context.params?.slug as string
        const blog = blogs.find((blog) => blog.slug === blogSlug)

        if (!blog) {
            return returnObj
        }

        const filePath = path.join(process.cwd(), "public", `blog/${blogSlug}.md`)
        const fileContent = await fs.readFile(filePath, "utf8")
        const { content } = matter(fileContent)

        // Extract headings for TOC
        const tokens = marked.lexer(content)
        const tocItems: TocItem[] = []
        const slugCounts: Record<string, number> = {}

        tokens.forEach((token) => {
            if (token.type === "heading") {
                const headingToken = token as { type: "heading"; depth: number; text: string }
                if (headingToken.depth >= 2 && headingToken.depth <= 3) {
                    let slug = slugify(headingToken.text)

                    // Handle duplicate slugs by appending a number
                    if (slugCounts[slug] !== undefined) {
                        slugCounts[slug]++
                        slug = `${slug}-${slugCounts[slug]}`
                    } else {
                        slugCounts[slug] = 0
                    }

                    tocItems.push({
                        id: slug,
                        text: headingToken.text,
                        level: headingToken.depth
                    })
                }
            }
        })

        // Configure marked to add IDs to headings
        const renderer = new marked.Renderer()
        const headingSlugCounts: Record<string, number> = {}

        renderer.heading = function (text: string, level: number) {
            let slug = slugify(text.replace(/<[^>]+>/g, ''))

            // Handle duplicate slugs
            if (headingSlugCounts[slug] !== undefined) {
                headingSlugCounts[slug]++
                slug = `${slug}-${headingSlugCounts[slug]}`
            } else {
                headingSlugCounts[slug] = 0
            }

            return `<h${level} id="${slug}">${text}</h${level}>\n`
        }

        const parsedBlogHTML = marked.parse(content, { renderer }) as string

        returnObj = {
            props: {
                blog: blog,
                parsedBlogHTML,
                tocItems
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error)
        return returnObj
    }

    return returnObj
}

export const getStaticPaths: GetStaticPaths = async () => {
    // Generate the paths we want to pre-render based on blogs
    const paths = blogs.map((blog) => ({
        params: { slug: blog.slug },
    }))

    // Return the paths with a fallback strategy
    return { paths, fallback: false } // Or use 'blocking' or true for fallback pages
}

export default BlogPost
