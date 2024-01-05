import Footer from "../../components/footer";
import Header from "../../components/header";
import BytebaseBanner from "../../components/SponsorView";
import SponsorBanner from "../../components/SponsorStaticBanner";
import HighlightBlogSection from "../../components/HighlightBlogSection";
import Author from "./interfaces/author";
import { getAllPosts } from './lib/api'
import matter from 'gray-matter'
import Link from "next/link";
import Post from "./interfaces/post";
import Image from 'next/image'



type Props = {
  title: string
  coverImage: string
  date: string
  excerpt: string
  author: Author
  src: string
  slug: string
  allPosts: Post[]
}

const BlogPage = ({
  title,
  coverImage,
  date,
  excerpt,
  src,
  author,
  slug,
}: Props) => {
  return (
    <div className="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
      <Header />
      <div className="w-full h-auto grow lg:grid lg:grid-cols-[256px_1fr_256px]">
        <div className="w-full hidden lg:block">
          <HighlightBlogSection />
        </div>
        <div className="w-full flex flex-col justify-start items-center">
          <section className="w-full grow px-3 md:w-5/6 lg:max-w-6xl h-auto flex flex-col justify-start items-center self-center">
            <p
              className="mt-12 p-8 text-4xl font-bold text-dark"
              style={{ fontFamily: "xkcd" }}
            >
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
                  backgroundColor: "transparent",
                }}
              ></iframe>
            </div>


              <div className="grow w-full flex flex-col justify-center items-center">
        
      
          

            

              <div className="w-full flex flex-col justify-start items-center">
                {/* Featured blogs */}
   
                <div className="w-full mt-8 flex flex-col justify-start items-start">
                <div>

                  
                    <div
                      className="w-full h-auto flex flex-col border rounded-md mb-8"
                    >
                      <Link href={'/blog/${slug}'} as={`/blog/${slug}`}>
                  
                          <img
                            className="h-60 w-full flex-shrink-0 object-cover rounded-t-md"
                            src={coverImage}
                          />
                      
                      </Link>
                      <div className="w-full p-6 py-4 flex flex-col justify-start">
                        <div className="mt-2 w-full flex flex-col justify-start items-start">
                          <Link href={'/blog/${slug}'}>
                            <p className="text-xl font-semibold text-dark">
                              {title}
                            </p>
                          </Link>
                          <p className="mt-3 text-base text-gray-500 line-clamp-3">
                            {excerpt}
                          </p>
                        </div>
                        <div className="mt-3 flex flex-row justify-start items-center">
                          <p className="flex space-x-1 text-sm text-gray-500">
                            <span className="text-sm font-medium text-gray-900">
                              {/* {author.name} */}
                            </span>
                            <span aria-hidden="true"> &middot; </span>
                            {/* <time dateTime={blog.publishedDate}>
                              {new Date(blog.publishedDate).toLocaleString(
                                "default",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </time> */}
                            <span aria-hidden="true"> &middot; </span>
                            {/* <span>{blog.readingTime}</span> */}
                          </p>
                        </div>
                      </div>
                    </div>
                
                </div>
            
                </div>
              </div>
    </div>
          </section>
          <BytebaseBanner />
        </div>
        <div className="w-full hidden lg:block"></div>
      </div>
      <Footer />
      <SponsorBanner />
    </div>
  );
}
export default BlogPage
