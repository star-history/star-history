import { useEffect, useState } from "react"
import Head from "next/head"
import Header from "../../components/header"
import Footer from "../../components/footer"
import SponsorBanner from "../../components/SponsorStaticBanner"
import BytebaseBanner from "../../components/SponsorView"
import HighlightBlogSection from "../../components/HighlightBlogSection"
import utils from "common/utils"
import Link from "next/link"
import blogData from "../../public/blog/data.json"
import { NextPageWithLayout } from "pages/_app"
import { AppStateProvider } from "store"
import { marked } from "marked"
import { GetServerSidePropsContext } from "next"
import path from "path"
import blogs from "public/blog/assets/data.json"

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

interface State {
    isLoading: boolean
    blog?: Array<Blog>
    parsedBlogHTML?: string
}

const Blog: NextPageWithLayout = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rawBlogList = blogData
                const blogList: Blog[] = await Promise.all(
                    rawBlogList.map(async (raw: Blog) => {
                        const contentRes = await fetch(`/blog/assets/${raw.slug}.md`)
                        const content = await contentRes.text()

                        // Calculate reading time based on the content
                        const wordsPerMinute = 200
                        const wordCount = content.split(" ").length
                        const readingTime = Math.ceil(wordCount / wordsPerMinute)

                        console.log(contentRes, "haha")

                        return {
                            ...raw,
                            readingTime: `${readingTime} min read`
                        }
                    })
                )

                console.log("Blog List:", blogList)

                const featuredBlogs = blogList.filter((blog) => blog.featured)
                const blogs = blogList.filter((blog) => !blog.featured)

                console.log("Featured Blogs:", featuredBlogs)
                console.log("Blogs:", blogs)

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
                <title>GitHub Star History</title>
            </Head>
            <div className="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
                <Header />
                <div className="w-full h-auto grow lg:grid lg:grid-cols-[256px_1fr_256px]">
                    <div className="w-full hidden lg:block">
                        <HighlightBlogSection clickLink={(link) => (window.location.href = link)} />
                    </div>
                    <div className="w-full flex flex-col justify-start items-center">
                        <section className="w-full grow px-3 md:w-5/6 lg:max-w-6xl h-auto flex flex-col justify-start items-center self-center">
                            <p className="mt-12 p-8 text-4xl font-bold text-dark" style={{ fontFamily: "xkcd" }}>
                                Star History Blog
                            </p>
                            <div className="mb-4">
                                <iframe
                                    src="https://embeds.beehiiv.com/2803dbaa-d8dd-4486-8880-4b843f3a7da6?slim=true"
                                    data-test-id="beehiiv-embed"
                                    height="52"
                                    frameBorder="0"
                                    scrolling="no"
                                    style={{
                                        margin: 0,
                                        borderRadius: "0px !important",
                                        backgroundColor: "transparent"
                                    }}
                                ></iframe>
                            </div>
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
                                                    <img className="h-60 w-full flex-shrink-0 object-cover rounded-t-md" src={blog.featureImage} />
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
                    <div className="w-full hidden lg:block"></div>
                </div>
                <Footer />
                <SponsorBanner />
            </div>
        </AppStateProvider>
    )
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   let returnObj = {
//     props: {
//       isLoading: true,
//       blog: [],
//       parsedBlogHTML: "",
//     },
//   };

//   try {

//     if (!blogs) {
//       return returnObj;
//     }

//     const filePath = path.join(process.cwd(), 'public', `blog/assets/${blogSlug}.md`);
//     const content = await fs.readFile(filePath, 'utf8');

//     // Calculate reading time
//     const wordsPerMinute = 200;
//     const wordCount = content.split(" ").length;
//     const readingTime = Math.ceil(wordCount / wordsPerMinute);

//     // Update return object with blog data, reading time, and set isLoading: false
//     returnObj = {
//       props: {
//         isLoading: false,
//         blog: {
//           ...blog,
//           readingTime: readingTime, // Add reading time to the blog object
//         },
//         parsedBlogHTML: marked.parse(content),
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return returnObj;
//   }

//   return returnObj;
// }

export default Blog
