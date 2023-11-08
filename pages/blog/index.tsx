import { useEffect, useState } from "react";
import Footer from "../../components/footer";
import Header from "../../components/header";
import BytebaseBanner from "../../components/SponsorView";
import SponsorBanner from "../../components/SponsorStaticBanner";
import HighlightBlogSection from "../../components/HighlightBlogSection";
import {
  range,
  getTimeStampByDate,
  getDateString,
  calcReadingTime,
} from "../../common/utils";
import Link from "next/link";
import { BiLoaderAlt } from "react-icons/Bi";
import data from "../../helpers/data.json";

interface Blog {
  slug: string;
  featureImage: string;
  title: string;
  excerpt: string;
  author: string;
  publishedDate: string;
  readingTime: string;
  featured: boolean;
}

interface State {
  isLoading: boolean;
  blogs: Blog[];
  featuredBlogs: Blog[];
}

const BlogPage = () => {
  const [state, setState] = useState<State>({
    isLoading: true,
    blogs: [],
    featuredBlogs: [],
  });

   useEffect(() => {
    
     const fetchData = async () => {
      const res = await fetch("/data.json");
      const rawBlogList = await res.json();
       console.log(rawBlogList);

    const blogList: Blog[] = [];
     for (const raw of rawBlogList) {
       const contentRes = await fetch(`/blog/${raw.slug}.md`);
        const content = await contentRes.text();

       blogList.push({
          ...raw,
        readingTime: calcReadingTime(content),
       });
      }

     const featuredBlogs = blogList.filter(blog => blog.featured);
     const blogs = blogList.filter(blog => !blog.featured);

     setState({
        isLoading: false,
        blogs,
        featuredBlogs,
     });
     };

    fetchData();
 }, []);

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

            <div>
              {data.map(blog => (
                <div key={blog.slug}>
                  <h2>{blog.title}</h2>
                  <p>{blog.excerpt}</p>
                </div>
              ))}
            </div>

            {state.isLoading ? (
              <div className="grow w-full flex flex-col justify-center items-center">
              </div>
            ) : state.featuredBlogs.length + state.blogs.length === 0 ? (
              <div className="w-full h-10 flex flex-col justify-center items-center">
                <p className="text-center leading-8 text-lg text-dark font-medium">
                  Oops! No article found.
                </p>
              </div>

            
            ) : (
              <div className="w-full flex flex-col justify-start items-center">
                {/* Featured blogs */}
                )
                <div className="w-full mt-8 flex flex-col justify-start items-start">
                <div>

                  
                  {data.map(blog => (
                    <div key={blog.slug}
                      className="w-full h-auto flex flex-col border rounded-md mb-8"
                    >
                      <Link href={`/blog/${blog.slug}`}>
                        <a>
                          <img
                            className="h-60 w-full flex-shrink-0 object-cover rounded-t-md"
                            src={blog.featureImage}
                          />
                        </a>
                      </Link>
                      <div className="w-full p-6 py-4 flex flex-col justify-start">
                        <div className="mt-2 w-full flex flex-col justify-start items-start">
                          <Link href={`/blog/${blog.slug}`}>
                            <a className="text-xl font-semibold text-dark">
                              {blog.title}
                            </a>
                          </Link>
                          <p className="mt-3 text-base text-gray-500 line-clamp-3">
                            {blog.excerpt}
                          </p>
                        </div>
                        <div className="mt-3 flex flex-row justify-start items-center">
                          <p className="flex space-x-1 text-sm text-gray-500">
                            <span className="text-sm font-medium text-gray-900">
                              {blog.author}
                            </span>
                            <span aria-hidden="true"> &middot; </span>
                            <time dateTime={blog.publishedDate}>
                              {new Date(blog.publishedDate).toLocaleString(
                                "default",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </time>
                            <span aria-hidden="true"> &middot; </span>
                            {/* <span>{blog.readingTime}</span> */}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Normal blogs */}
                <div className="w-full flex flex-col justify-start items-start grow mb-16">
                  {data.map(blog => (
                    <div
                      key={blog.slug}
                      className="w-full h-auto flex flex-col-reverse justify-start lg:flex-row lg:justify-between border rounded-md mb-4"
                    >
                      <div className="p-6 pr-4 w-full flex flex-col justify-start items-start">
                        <div className="w-full flex flex-col justify-start items-start">
                          <Link href={`/blog/${blog.slug}`}>
                            <a className="text-xl font-semibold text-dark">
                              {blog.title}
                            </a>
                          </Link>
                          <p className="w-full mt-3 text-base text-gray-500 break-words line-clamp-3">
                            {blog.excerpt}
                          </p>
                        </div>
                        <div className="grow"></div>
                        <div className="flex flex-row justify-start items-center">
                          <p className="flex ml-2 space-x-1 text-sm text-gray-500">
                            <span className="text-sm ml-2 font-medium text-gray-900">
                              {blog.author}
                            </span>
                            <span aria-hidden="true"> &middot; </span>
                            <time dateTime={blog.publishedDate}>
                              {new Date(blog.publishedDate).toLocaleString(
                                "default",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </time>
                            <span aria-hidden="true"> &middot; </span>
                            {/* <span>{blog.readingTime}</span> */}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </div>
            )}
          </section>
          <BytebaseBanner />
        </div>
        <div className="w-full hidden lg:block"></div>
      </div>
      <Footer />
      <SponsorBanner />
    </div>
  );
};

export default BlogPage;
