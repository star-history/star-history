<template>
  <div class="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
    <Header />
    <div class="w-full h-auto grow lg:grid lg:grid-cols-[256px_1fr_256px]">
      <div class="w-full hidden lg:block">
        <HighlightBlogSection />
      </div>
      <div class="w-full flex flex-col justify-start items-center">
        <div
          v-if="state.isLoading"
          class="grow w-full flex flex-col justify-center items-center"
        >
          <i class="fas fa-spinner animate-spin text-4xl z-10"></i>
        </div>
        <div
          v-else-if="state.blog === undefined"
          class="w-full h-10 flex flex-col justify-center items-center"
        >
          <p class="text-center leading-8 text-lg text-dark font-medium">
            Oops! No article found.
          </p>
          <p class="text-center leading-8 text-lg text-dark font-medium">
            <router-link
              class="mt-3 flex flex-row justify-center items-center"
              to="/blog"
            >
              <button
                class="w-full px-4 py-2 h-full text-base rounded-md bg-gray-400 shadow-inner text-light hover:bg-gray-500"
              >
                <i class="fas fa-chevron-left mr-1"></i>
                Back to blog list
              </button>
            </router-link>
          </p>
        </div>
        <div
          v-else
          class="w-full p-4 md:p-0 mt-6 md:w-5/6 lg:max-w-6xl h-full flex flex-col justify-start items-center self-center"
        >
          <img
            class="hidden md:block w-auto max-w-full object-scale-down"
            :src="state.blog.featureImage || ''"
          />
          <!-- title -->
          <div
            class="w-auto max-w-6xl mt-4 md:mt-12 prose prose-indigo prose-xl md:prose-2xl flex flex-col justify-center items-center"
          >
            <h1 class="leading-16">
              {{ state.blog.title }}
            </h1>
          </div>
          <!-- author information -->
          <div
            class="w-full mt-8 mb-2 max-w-6xl px-2 flex flex-row items-center justify-center text-sm text-gray-900 font-semibold tracking-wide uppercase"
          >
            <div class="flex space-x-1 text-gray-500">
              <span class="text-gray-900">
                {{ state.blog.author }}
              </span>
              <span aria-hidden="true"> &middot; </span>
              <time :datetime="state.blog.publishedDate">
                {{
                  new Date(state.blog.publishedDate || "").toLocaleString(
                    "default",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )
                }}
              </time>
              <span aria-hidden="true"> &middot; </span>
              <span> {{ state.blog.readingTime }} </span>
            </div>
          </div>
          <div
            class="blog-content-container w-full max-w-5xl prose prose-indigo prose-xl md:prose-2xl"
            v-html="state.parsedBlogHTML"
          ></div>
          <div
            v-if="!state.isLoading && state.blog === undefined"
            class="w-full h-10 flex flex-col justify-center items-center"
          >
            <p class="text-center leading-8 text-lg text-dark font-medium">
              Oops! No article found.
            </p>
            <p class="text-center leading-8 text-lg text-dark font-medium">
              <router-link
                class="mt-3 flex flex-row justify-center items-center"
                to="/blog"
              >
                <button
                  class="w-full px-4 py-2 h-full text-base rounded-md bg-gray-400 shadow-inner text-light hover:bg-gray-500"
                >
                  <i class="fas fa-chevron-left mr-1"></i>
                  Back to blog list
                </button>
              </router-link>
            </p>
          </div>
        </div>
        <div class="mt-12">
          <iframe
            src="https://embeds.beehiiv.com/2803dbaa-d8dd-4486-8880-4b843f3a7da6?slim=true"
            data-test-id="beehiiv-embed"
            height="52"
            frameborder="0"
            scrolling="no"
            style="
              margin: 0;
              border-radius: 0px !important;
              background-color: transparent;
            "
          ></iframe>
        </div>
        <SponsorFooterBanner
          v-if="!state.isLoading"
          class="mt-16 mb-8"
        ></SponsorFooterBanner>
      </div>
      <div class="w-full hidden lg:block"></div>
    </div>
    <Footer />
    <SponsorRightBanner />
  </div>
</template>

<script lang="ts" setup>
import { marked } from "marked";
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import utils from "../../common/utils";
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import SponsorFooterBanner from "../components/SponsorView.vue";
import SponsorRightBanner from "../components/SponsorStaticBanner.vue";
import HighlightBlogSection from "../components/HighlightBlogSection.vue";

interface State {
  isLoading: boolean;
  blog?: Blog;
  parsedBlogHTML?: string;
}

const state = reactive<State>({
  isLoading: true,
});
const currentRoute = useRoute();

onMounted(async () => {
  const blogSlug = currentRoute.params.blogSlug as string;
  const blogListRes = await fetch("/blog/data.json");
  const blogList = (await blogListRes.json()) as Blog[];
  const blog = blogList.find((blog) => blog.slug === blogSlug);
  if (!blog) {
    return;
  }

  const contentRes = await fetch(`/blog/${blogSlug}.md`);
  const content = await contentRes.text();
  state.blog = {
    ...blog,
    readingTime: utils.calcReadingTime(content),
  };
  state.parsedBlogHTML = marked.parse(content);
  state.isLoading = false;
});
</script>

<style>
.blog-content-container > h1 {
  display: none !important;
}
</style>
