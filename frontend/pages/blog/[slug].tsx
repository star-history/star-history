/* eslint-disable @next/next/no-img-element */
import { marked } from "marked"
import Link from "next/link"
import Footer from "../../components/footer"
import Header from "../../components/header"
import SponsorFooterBanner from "../../components/SponsorView"
import RightSidebar from "../../components/RightSidebar"
import { GetStaticPropsContext, GetStaticPaths } from "next"
import path from "path"
import fs from "fs/promises"
import blogs from "helpers/blog.json"
import { AppStateProvider } from "store"

interface Blog {
    title: string
    slug: string
    author: string
    excerpt: string
    publishedDate: string
    featureImage?: string
    readingTime?: number
    featured?: boolean // Add this line if 'featured' is part of your data
}

interface State {
    blog: Blog
    parsedBlogHTML?: string
}

const BlogPost: React.FC<State> = ({ blog, parsedBlogHTML }) => {
    return (
        <AppStateProvider>
            <div className="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
                <title>{blog ? `${blog.title}` : "GitHub Star History"}</title>
                {
                    blog && (
                        <>
                            {/* Standard Meta Tags */}
                            <meta name="description" content={blog.excerpt} />

                            {/* Open Graph / Facebook */}
                            <meta property="og:type" content="website" />
                            <meta property="og:url" content={`https://star-history.com/blog/${blog.slug}`} />
                            <meta property="og:title" content={blog.title} />
                            <meta property="og:description" content={blog.excerpt} />
                            <meta property="og:image" content={`https://star-history.com${blog.featureImage}`} />

                            {/* Twitter */}
                            <meta name="twitter:card" content="summary_large_image" />
                            <meta name="twitter:url" content={`https://star-history.com/blog/${blog.slug}`} />
                            <meta name="twitter:title" content={blog.title} />
                            <meta name="twitter:description" content={blog.excerpt} />
                            <meta name="twitter:image" content={`https://star-history.com${blog.featureImage}`} />
                        </>
                    )
                }

                <Header />
                <div className="w-full h-auto grow flex flex-row justify-center">
                    <div className="w-full md:max-w-5xl lg:max-w-7xl px-0 sm:px-4 h-auto grow lg:grid lg:grid-cols-[1fr_256px]">
                        {
                            blog == null ? (
                                <div className="w-full h-10 flex flex-col justify-center items-center">
                                <p className="text-center leading-8 text-lg text-dark font-medium">Oops! No article found.</p>
                                <p className="text-center leading-8 text-lg text-dark font-medium">
                                    <Link href="/blog">
                                        <button className="w-full px-4 py-2 h-full text-base rounded-md bg-gray-400 shadow-inner text-light hover:bg-gray-500">
                                            <i className="fas fa-chevron-left mr-1"></i>
                                            Back to blog list
                                        </button>
                                    </Link>
                                </p>
                            </div>
                        ) : (
                            <div className="w-full flex flex-col justify-start sm:-ml-4">
                                <div className="w-full mt-6 h-full flex flex-col justify-start">
                                    <img className="hidden md:block w-auto max-w-3xl object-scale-down mx-auto" src={blog.featureImage || ""} alt="" />
                                    <div className="w-auto max-w-6xl mt-6 md:mt-8 prose prose-indigo prose-base md:prose-lg flex flex-col justify-center items-center">
                                        <h1 className="leading-16 font-normal">{blog.title}</h1>
                                    </div>
                                    <div className="w-full mt-6 mb-2 max-w-6xl px-2 flex flex-row items-center justify-center text-sm text-gray-900 font-semibold trackingwide uppercase">
                                        <div className="flex space-x-1 text-gray-500">
                                            <span className="text-gray-900">{blog.author}</span>
                                            <span aria-hidden="true"> &middot; </span>
                                            <time dateTime={blog.publishedDate}>
                                                {new Date(blog.publishedDate || "").toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric"
                                                })}
                                            </time>

                                            <span aria-hidden="true"> &middot; </span>
                                            <span> {blog.readingTime} min read </span>
                                        </div>
                                    </div>
                                    <div className="mt-10 md:mt-12 w-full max-w-5xl prose prose-indigo prose-xl md:prose-2xl" dangerouslySetInnerHTML={{ __html: parsedBlogHTML || "" }} />
                                </div>

                                <SponsorFooterBanner className="mt-16 mb-8" />
                            </div>
                        )
                        }
                        <div className="w-full hidden lg:block sm:-mr-4">
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
            parsedBlogHTML: ""
            // readingTime: 0,
        }
    }

    try {
        const blogSlug = context.params?.slug as string
        const blog = blogs.find((blog) => blog.slug === blogSlug)

        if (!blog) {
            return returnObj
        }

        const filePath = path.join(process.cwd(), "public", `blog/${blogSlug}.md`)
        const content = await fs.readFile(filePath, "utf8")

        // Calculate reading time
        const wordsPerMinute = 200
        const wordCount = content.split(" ").length
        const readingTime = Math.ceil(wordCount / wordsPerMinute)

        // Update return object with blog data, reading time
        returnObj = {
            props: {
                blog: {
                    ...blog,
                    readingTime: readingTime // Add reading time to the blog object
                },
                parsedBlogHTML: marked.parse(content)
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
