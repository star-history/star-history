import { useEffect, useState } from "react";
import { marked } from "marked";
import { useRouter } from "next/router";
import Link from "next/link";
import Footer from "../../components/footer";
import Header from "../../components/header";
import SponsorFooterBanner from "../../components/SponsorView";
import SponsorRightBanner from "../../components/SponsorStaticBanner";
import HighlightBlogSection from "../../components/HighlightBlogSection";
import { GetServerSidePropsContext } from "next";
import path from "path";
import fs from "fs/promises";

import blogs from "public/blog/assets/data.json"

interface Blog {
  title: string;
  slug: string;
  author: string;
  publishedDate: string;
  featureImage?: string;
  readingTime?: number;
}

interface State {
  isLoading: boolean;
  blog?: Blog;
  parsedBlogHTML?: string;
}

const BlogPost: React.FC<State> = ({ isLoading, blog, parsedBlogHTML }) => {
  // No need for useRouter here since the data will be fetched using getServerSideProps
  // const router = useRouter();

  // The props are passed by getServerSideProps, no need for the State and useEffect

  const calcReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <div className="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
      <Header />
      <div className="w-full h-auto grow lg:grid lg:grid-cols-[256px_1fr_256px]">
        <div className="w-full hidden lg:block">
          <HighlightBlogSection />
        </div>
        <div className="w-full flex flex-col justify-start items-center">
          {isLoading ? (
            <div className="grow w-full flex flex-col justify-center items-center">
              <i className="fas fa-spinner animate-spin text-4xl z-10"></i>
            </div>
          ) : blog === undefined ? (
            <div className="w-full h-10 flex flex-col justify-center items-center">
              <p className="text-center leading-8 text-lg text-dark font-medium">
                Oops! No article found.
              </p>
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
            <div className="w-full p-4 md:p-0 mt-6 md:w-5/6 lg:max-w-6xl h-full flex flex-col justify-start items-center self-center">
              <img
                className="hidden md:block w-auto max-w-full object-scale-down"
                src={blog.featureImage || ""}
              />
              <div className="w-auto max-w-6xl mt-4 md:mt-12 prose prose-indigo prose-xl md:prose-2xl flex flex-col justify-center items-center">
                <h1 className="leading-16">{blog.title}</h1>
              </div>
              <div className="w-full mt-8 mb-2 max-w-6xl px-2 flex flex-row items-center justify-center text-sm text-gray-900 font-semibold trackingwide uppercase">
                <div className="flex space-x-1 text-gray-500">
                  <span className="text-gray-900">{blog.author}</span>
                  <span aria-hidden="true"> &middot; </span>
                  <time dateTime={blog.publishedDate}>
                    {new Date(blog.publishedDate || "").toLocaleString("default", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  <span aria-hidden="true"> &middot; </span>
                  <span> {blog.readingTime} </span>
                </div>
              </div>
              <div
                className="blog-content-container w-full max-w-5xl prose prose-indigo prose-xl md:prose-2xl"
                dangerouslySetInnerHTML={{ __html: parsedBlogHTML || "" }}
              />
              <div className="w-full h-10 flex flex-col justify-center items-center">
                <p className="text-center leading-8 text-lg text-dark font-medium">
                  Oops! No article found.
                </p>
                <p className="text-center leading-8 text-lg text-dark font-medium">
                  <Link href="/blog">
                    <button className="w-full px-4 py-2 h-full text-base rounded-md bg-gray-400 shadow-inner text-light hover:bg-gray-500">
                      <i className="fas fa-chevron-left mr-1"></i>
                      Back to blog list
                    </button>
                  </Link>
                </p>
              </div>
            </div>
          )}
          <div className="mt-12">
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
            />
          </div>
          <SponsorFooterBanner className="mt-16 mb-8" />
        </div>
        <div className="w-full hidden lg:block"></div>
      </div>
      <Footer />
      <SponsorRightBanner />
    </div>
  );
};

// Use getServerSideProps to fetch data based on the dynamic parameter
// Use getServerSideProps to fetch data based on the dynamic parameter
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Default return object
  let returnObj = {
    props: {
      isLoading: true,
      blog: null,
      parsedBlogHTML: "",
    },
  };

  try {
    // Your existing code...
    const blogSlug = context.params?.slug as string;

    const blog = blogs.find((blog) => blog.slug === blogSlug);

    if (!blog) {
      return {
        notFound: true,
      };
    }

    const filePath = path.join(process.cwd(), 'public', `blog/assets/${blogSlug}.md`)
    const content = await fs.readFile(filePath, 'utf8')

    // Update return object
    returnObj = {
      props: {
        isLoading: false,
        blog: blog as any, // correct the blog type
        parsedBlogHTML: marked.parse(content),
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return returnObj;
}

export default BlogPost;
