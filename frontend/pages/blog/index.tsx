import Head from "next/head"
import Header from "../../components/header"
import Footer from "../../components/footer"
import BytebaseBanner from "../../components/SponsorView"
import RightSidebar from "../../components/RightSidebar"
import Link from "next/link"
import blogData from "helpers/blog.json"
import { NextPageWithLayout } from "pages/_app"
import { SketchMailboxIcon } from "../../components/SketchIcons"
import { NEWSLETTER_URL } from "../../helpers/consts"

interface Blog {
    slug: string
    title: string
    description: string
    publishedDate: string
    featured?: boolean
}

const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const blogs = blogData as Blog[]
const featured = blogs.find((b) => b.featured)
const rest = blogs.filter((b) => b !== featured)

const BlogPage: NextPageWithLayout = () => {
    return (
        <>
            <Head>
                <title>Star History Blog</title>
            </Head>
            <div className="relative w-full h-auto min-h-screen flex flex-col overflow-x-hidden">
                <Header />
                <div className="w-full h-auto grow flex flex-row justify-center">
                    <div className="w-full px-4 h-auto grow lg:grid lg:grid-cols-[1fr_288px] lg:gap-8">
                        <div className="w-full flex flex-col justify-start">
                            <section className="w-full h-auto flex flex-col justify-start items-start">
                            <div className="mt-8 px-2 py-6 w-full flex items-baseline gap-4">
                                <h1 className="text-4xl font-bold text-dark">Star History Blog</h1>
                                <a
                                    href={NEWSLETTER_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-gray-700 hover:underline"
                                >
                                    <SketchMailboxIcon /> Subscribe
                                </a>
                            </div>
                            {blogs.length === 0 && (
                                <div className="w-full h-10 flex flex-col justify-center items-center">
                                    <p className="text-center leading-8 text-lg text-dark font-medium">Oops! No article found.</p>
                                </div>
                            )}
                            {blogs.length > 0 && (
                                <div className="w-full px-2 flex flex-col justify-start items-start mb-16">
                                    {featured && (
                                        <Link href={`/blog/${featured.slug}`} className="w-full group mb-2">
                                            <div className="py-6 border-b border-gray-200">
                                                <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">Featured</p>
                                                <h2 className="text-2xl font-semibold text-dark group-hover:underline">{featured.title}</h2>
                                                {featured.description && (
                                                    <p className="mt-2 text-gray-600">{featured.description}</p>
                                                )}
                                                <p className="mt-2 text-sm text-gray-500">{formatDate(featured.publishedDate)}</p>
                                            </div>
                                        </Link>
                                    )}
                                    {rest.map((blog) => (
                                        <Link key={blog.slug} href={`/blog/${blog.slug}`} className="w-full group">
                                            <div className="py-4 border-b border-gray-200 flex items-center justify-between gap-4">
                                                <h2 className="text-lg font-medium text-dark group-hover:underline truncate">{blog.title}</h2>
                                                <span className="text-sm text-gray-500 shrink-0">{formatDate(blog.publishedDate)}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </section>
                        <BytebaseBanner className="mb-8 hidden lg:block" />
                        </div>
                        <div className="hidden lg:block">
                            <RightSidebar />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default BlogPage
