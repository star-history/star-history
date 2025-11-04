/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react"
import Head from "next/head"
import Header from "../../components/header"
import Footer from "../../components/footer"
import BytebaseBanner from "../../components/SponsorView"
import RightSidebar from "../../components/RightSidebar"
import Link from "next/link"
import blogData from "helpers/blog.json"
import { NextPageWithLayout } from "pages/_app"
import { AppStateProvider } from "store"

interface Blog {
    slug: string
    title: string
    excerpt: string
    author: string
    publishedDate: string
    readingTime?: string
    featured?: boolean
    featureImage?: string
}

const BlogPage: NextPageWithLayout = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rawBlogList = blogData
                const blogList: Blog[] = await Promise.all(
                    rawBlogList.map(async (raw: Blog) => {
                        const contentRes = await fetch(`/blog/${raw.slug}.md`)
                        const content = await contentRes.text()

                        // Calculate reading time based on the content
                        const wordsPerMinute = 200
                        const wordCount = content.split(" ").length
                        const readingTime = Math.ceil(wordCount / wordsPerMinute)
                        return {
                            ...raw,
                            readingTime: `${readingTime} min read`
                        }
                    })
                )

                const featuredBlogs = blogList.filter((blog) => blog.featured)
                const blogs = blogList.filter((blog) => !blog.featured)

                setFeaturedBlogs(featuredBlogs)
                setBlogs(blogs)
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error)
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <AppStateProvider>
            <Head>
                <title>Star History Blog</title>
            </Head>
            <div className="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
                <Header />
                <div className="w-full h-auto grow flex flex-row justify-center">
                    <div className="w-full md:max-w-5xl lg:max-w-7xl px-0 sm:px-4 h-auto grow lg:grid lg:grid-cols-[1fr_256px]">
                        <div className="w-full flex flex-col justify-start sm:-ml-4">
                            <section className="w-full h-auto flex flex-col justify-start items-start">
                            <h1 className="mt-12 p-8 text-4xl font-bold text-dark" style={{ fontFamily: "xkcd" }}>
                                Star History Blog
                            </h1>
                            {isLoading && (
                                <div className="grow w-full flex flex-col justify-center items-center">
                                    <i className="fas fa-spinner animate-spin text-4xl z-10"></i>
                                </div>
                            )}
                            {!isLoading && featuredBlogs.length + blogs.length === 0 && (
                                <div className="w-full h-10 flex flex-col justify-center items-center">
                                    <p className="text-center leading-8 text-lg text-dark font-medium">Oops! No article found.</p>
                                </div>
                            )}
                            {!isLoading && featuredBlogs.length + blogs.length > 0 && (
                                <div className="w-full flex flex-col justify-start items-center">
                                    <div className="w-full mt-8 flex flex-col justify-start items-start">
                                        {featuredBlogs.map((blog) => (
                                            <div key={blog.slug} className="w-full h-auto flex flex-col border rounded-md mb-8">
                                                <Link href={`/blog/${encodeURIComponent(blog.slug)}`}>
                                                    <img className="h-full w-auto flex-shrink-0 object-cover rounded-t-md" src={blog.featureImage} alt="" />
                                                </Link>

                                                <div className="w-full p-6 py-4 flex flex-col justify-start">
                                                    <div className="mt-2 w-full flex flex-col justify-start items-start">
                                                        <Link href={`/blog/${blog.slug}`}>
                                                            <p className="text-xl font-semibold text-dark">{blog.title}</p>
                                                        </Link>
                                                        <p className="mt-3 text-base text-gray-500 line-clamp-3">{blog.excerpt}</p>
                                                    </div>
                                                    <div className="mt-3 flex flex-row justify-start items-center">
                                                        <p className="flex space-x-1 text-sm text-gray-500">
                                                            <span className="text-sm font-medium text-gray-900">{blog.author}</span>
                                                            <span aria-hidden="true"> &middot; </span>
                                                            <time dateTime={blog.publishedDate}>
                                                                {new Date(blog.publishedDate).toLocaleString("default", {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric"
                                                                })}
                                                            </time>
                                                            <span aria-hidden="true"> &middot; </span>
                                                            <span> {blog.readingTime} </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-full flex flex-col justify-start items-start grow mb-16">
                                        {blogs.map((blog) => (
                                            <div key={blog.slug} className="w-full h-auto flex flex-col-reverse justify-start lg:flex-row lg:justify-between border rounded-md mb-4">
                                                <div className="p-6 pr-4 w-full flex flex-col justify-start items-start">
                                                    <div className="w-full flex flex-col justify-start items-start">
                                                        <Link href={`/blog/${blog.slug}`}>
                                                            <p className="text-xl font-semibold text-dark">{blog.title}</p>
                                                        </Link>
                                                        <p className="w-full mt-3 text-base text-gray-500 break-words line-clamp-3">{blog.excerpt}</p>
                                                    </div>
                                                    <div className="grow"></div>
                                                    <div className="flex flex-row justify-start items-center">
                                                        <p className="flex ml-2 space-x-1 text-sm text-gray-500">
                                                            <span className="text-sm ml-2 font-medium text-gray-900">{blog.author}</span>
                                                            <span aria-hidden="true"> &middot; </span>
                                                            <time dateTime={blog.publishedDate}>
                                                                {new Date(blog.publishedDate).toLocaleString("default", {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric"
                                                                })}
                                                            </time>
                                                            <span aria-hidden="true"> &middot; </span>
                                                            <span> {blog.readingTime} </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                {blog.featureImage && (
                                                    <img
                                                        className="shrink-0 w-full h-60 object-cover rounded-t-md lg:w-auto lg:h-auto lg:max-h-full lg:max-w-xs lg:m-2 lg:rounded-md"
                                                        src={blog.featureImage}
                                                        alt=""
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                        <BytebaseBanner className="mb-8" />
                        </div>
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

export default BlogPage
