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
            <div className="relative w-full h-auto min-h-screen flex flex-col">
                <Header />
                <div className="w-full h-auto grow flex flex-row justify-center">
                    <div className="w-full md:max-w-5xl lg:max-w-7xl px-0 sm:px-4 h-auto grow lg:grid lg:grid-cols-[1fr_288px]">
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
                                    <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {featuredBlogs.map((blog) => (
                                            <div key={blog.slug} className="h-auto flex flex-col border rounded-md">
                                                <Link href={`/blog/${encodeURIComponent(blog.slug)}`}>
                                                    <img className="h-48 w-full object-cover rounded-t-md" src={blog.featureImage} alt="" />
                                                </Link>

                                                <div className="w-full p-6 py-4 flex flex-col justify-start">
                                                    <Link href={`/blog/${blog.slug}`}>
                                                        <p className="text-xl font-normal text-dark">{blog.title}</p>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                                        {blogs.map((blog) => (
                                            <div key={blog.slug} className="h-auto flex flex-col border rounded-md">
                                                {blog.featureImage && (
                                                    <Link href={`/blog/${encodeURIComponent(blog.slug)}`}>
                                                        <img className="h-48 w-full object-cover rounded-t-md" src={blog.featureImage} alt="" />
                                                    </Link>
                                                )}
                                                <div className="w-full p-6 py-4 flex flex-col justify-start">
                                                    <Link href={`/blog/${blog.slug}`}>
                                                        <p className="text-xl font-normal text-dark">{blog.title}</p>
                                                    </Link>
                                                </div>
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
