import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/header';
import Footer from '../components/footer';
import SponsorFooterBanner from '../components/SponsorView';
import SponsorRightBanner from '../components/SponsorStaticBanner';
import HighlightBlogSection from '../components/HighlightBlogSection';
import { marked } from 'marked'; 
import utils from '../common/utils';

interface Blog {
  slug: string;
  title: string;
  author: string;
  publishedDate: string;
  featureImage?: string;
  readingTime: string;
}


interface State {
  isLoading: boolean;
  blog?: Blog;
  parsedBlogHTML?: string;
}

const blogdetail = () => {
  const [state, setState] = useState<State>({ isLoading: true });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { blogSlug } = router.query;
      const blogListRes = await fetch('/blog/data.json');
      const blogList = await blogListRes.json() as Blog[];
      const blog = blogList.find((blog) => blog.slug === blogSlug);

      if (!blog) {
        return;
      }

      const contentRes = await fetch(`/blog/${blogSlug}.md`);
      const content = await contentRes.text();

      setState({
        isLoading: false,
        blog: {
          ...blog,
          readingTime: utils.calcReadingTime(content),
        },
        parsedBlogHTML: marked.parse(content),
      });
    };

    fetchData();
  }, [router.query]);

  return (
    <div className="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
      <Header />
      <div className="w-full h-auto grow lg:grid lg:grid-cols-[256px_1fr_256px]">
        <div className="w-full hidden lg:block">
        <HighlightBlogSection clickLink={(link) => console.log(link)} />
        </div>
        <div className="w-full flex flex-col justify-start items-center">
          {state.isLoading && (
            <div className="grow w-full flex flex-col justify-center items-center">
              <i className="fas fa-spinner animate-spin text-4xl z-10"></i>
            </div>
          )}
          {!state.isLoading && state.blog === undefined && (
            <div className="w-full h-10 flex flex-col justify-center items-center">
              <p className="text-center leading-8 text-lg text-dark font-medium">
                Oops! No article found.
              </p>
              <p className="text-center leading-8 text-lg text-dark font-medium">
                <a href="/blog" className="mt-3 flex flex-row justify-center items-center">
                  <button className="w-full px-4 py-2 h-full text-base rounded-md bg-gray-400 shadow-inner text-light hover:bg-gray-500">
                    <i className="fas fa-chevron-left mr-1"></i>
                    Back to blog list
                  </button>
                </a>
              </p>
            </div>
          )}
          {!state.isLoading && state.blog && (
            <div className="w-full p-4 md:p-0 mt-6 md:w-5/6 lg:max-w-6xl h-full flex flex-col justify-start items-center self-center">
              <img
                className="hidden md:block w-auto max-w-full object-scale-down"
                src={state.blog.featureImage || ''}
              />
              <div className="w-auto max-w-6xl mt-4 md:mt-12 prose prose-indigo prose-xl md:prose-2xl flex flex-col justify-center items-center">
                <h1 className="leading-16">{state.blog.title}</h1>
              </div>
              <div className="w-full mt-8 mb-2 max-w-6xl px-2 flex flex-row items-center justify-center text-sm text-gray-900 font-semibold tracking-wide uppercase">
                <div className="flex space-x-1 text-gray-500">
                  <span className="text-gray-900">{state.blog.author}</span>
                  <span aria-hidden="true"> &middot; </span>
                  <time dateTime={state.blog.publishedDate}>
                    {new Date(state.blog.publishedDate || '').toLocaleString('default', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  <span aria-hidden="true"> &middot; </span>
                  <span> {state.blog.readingTime} </span>
                </div>
              </div>
              <div
                className="blog-content-container w-full max-w-5xl prose prose-indigo prose-xl md:prose-2xl"
                dangerouslySetInnerHTML={{ __html: state.parsedBlogHTML || '' }}
              ></div>
            </div>
          )}
          {!state.isLoading && state.blog === undefined && (
            <div className="w-full h-10 flex flex-col justify-center items-center">
              <p className="text-center leading-8 text-lg text-dark font-medium">
                Oops! No article found.
              </p>
              <p className="text-center leading-8 text-lg text-dark font-medium">
                <a href="/blog" className="mt-3 flex flex-row justify-center items-center">
                  <button className="w-full px-4 py-2 h-full text-base rounded-md bg-gray-400 shadow-inner text-light hover:bg-gray-500">
                    <i className="fas fa-chevron-left mr-1"></i>
                    Back to blog list
                  </button>
                </a>
              </p>
            </div>
          )}
        </div>
        <div className="mt-12">
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
        <SponsorFooterBanner v-if={!state.isLoading} className="mt-16 mb-8"></SponsorFooterBanner>
      </div>
      <div className="w-full hidden lg:block"></div>
      <Footer />
      <SponsorRightBanner />
    </div>
  );
};

export default blogdetail;
