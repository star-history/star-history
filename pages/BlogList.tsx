// Import necessary Next.js modules and components
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/header';
import Footer from '../components/footer';
import BytebaseBanner from '../components/SponsorView';
import SponsorBanner from '../components/SponsorStaticBanner';
import HighlightBlogSection from '../components/HighlightBlogSection';
import React from 'react';

// Define the page component
const Home = () => {
  // Define the state interface
  interface Blog {
    slug: string;
    featured: boolean;
    featureImage: string;
    title: string;
    excerpt: string;
    author: string;
    publishedDate: string;
    readingTime: string;
  }

  interface State {
    isLoading: boolean;
    blogs: Blog[];
    featuredBlogs: Blog[];
  }

  // Use the useRouter hook to access the router object
  const router = useRouter();

  // Use the useEffect hook to fetch data and handle component mounting
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/blog/data.json');
      const rawBlogList = (await res.json()) as Blog[];
      const blogList: Blog[] = [];

      for (const raw of rawBlogList) {
        const contentRes = await fetch(`/blog/${raw.slug}.md`);
        const content = await contentRes.text();

        blogList.push({
          ...raw,
          readingTime: 'TODO: Implement calcReadingTime', // Replace with your calculation logic
        });
      }

      const featuredBlogs = blogList.filter((blog) => blog.featured);
      const blogs = blogList.filter((blog) => !blog.featured);

      // Update the state with fetched data
      setState({
        isLoading: false,
        blogs,
        featuredBlogs,
      });
    };

    fetchData();
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  // State initialization
  const initialState: State = {
    isLoading: true,
    blogs: [],
    featuredBlogs: [],
  };

  // Create reactive state using useState hook
  const [state, setState] = React.useState<State>(initialState);

  // Render the component
  return (
    <div className="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
      <Header />
      <div className="w-full h-auto grow lg:grid lg:grid-cols-[256px_1fr_256px]">
        <div className="w-full hidden lg:block">
        <HighlightBlogSection clickLink={(link) => console.log(link)} />
        </div>
        <div className="w-full flex flex-col justify-start items-center">
          <section className="w-full grow px-3 md:w-5/6 lg:max-w-6xl h-auto flex flex-col justify-start items-center self-center">
            <p className="mt-12 p-8 text-4xl font-bold text-dark" style={{ fontFamily: 'xkcd' }}>
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
                  borderRadius: '0px !important',
                  backgroundColor: 'transparent',
                }}
              ></iframe>
            </div>
            {state.isLoading ? (
              <div className="grow w-full flex flex-col justify-center items-center">
                <i className="fas fa-spinner animate-spin text-4xl z-10"></i>
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
                <div className="w-full mt-8 flex flex-col justify-start items-start">
                  {state.featuredBlogs.map((blog) => (
                    <div key={blog.slug} className="w-full h-auto flex flex-col border rounded-md mb-8">
                      <a href={`/blog/${blog.slug}`}>
                        <img
                          className="h-60 w-full flex-shrink-0 object-cover rounded-t-md"
                          src={blog.featureImage}
                          alt={blog.title}
                        />
                      </a>
                      <div className="w-full p-6 py-4 flex flex-col justify-start">
                        <div className="mt-2 w-full flex flex-col justify-start items-start">
                          <a href={`/blog/${blog.slug}`}>
                            <p className="text-xl font-semibold text-dark">{blog.title}</p>
                          </a>
                          <p className="mt-3 text-base text-gray-500 line-clamp-3">{blog.excerpt}</p>
                        </div>
                        <div className="mt-3 flex flex-row justify-start items-center">
                          <p className="flex space-x-1 text-sm text-gray-500">
                            <span className="text-sm font-medium text-gray-900">{blog.author}</span>
                            <span aria-hidden="true"> &middot; </span>
                            <time dateTime={blog.publishedDate}>
                              {new Date(blog.publishedDate).toLocaleString('default', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
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
                {/* Normal blogs */}
                <div className="w-full flex flex-col justify-start items-start grow mb-16">
                  {state.blogs.map((blog) => (
                    <div
                      key={blog.slug}
                      className="w-full h-auto flex flex-col-reverse justify-start lg:flex-row lg:justify-between border rounded-md mb-4"
                    >
                      <div className="p-6 pr-4 w-full flex flex-col justify-start items-start">
                        <div className="w-full flex flex-col justify-start items-start">
                          <a href={`/blog/${blog.slug}`}>
                            <p className="text-xl font-semibold text-dark">{blog.title}</p>
                          </a>
                          <p className="w-full mt-3 text-base text-gray-500 break-words line-clamp-3">
                            {blog.excerpt}
                          </p>
                        </div>
                        <div className="grow"></div>
                        <div className="flex flex-row justify-start items-center">
                          <p className="flex ml-2 space-x-1 text-sm text-gray-500">
                            <span className="text-sm ml-2 font-medium text-gray-900">{blog.author}</span>
                            <span aria-hidden="true"> &middot; </span>
                            <time dateTime={blog.publishedDate}>
                              {new Date(blog.publishedDate).toLocaleString('default', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
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
                          alt={blog.title}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
          {!state.isLoading && <BytebaseBanner />}
        </div>
        <div className="w-full hidden lg:block"></div>
      </div>
      <Footer />
      <SponsorBanner />
    </div>
  );
};

export default Home;
