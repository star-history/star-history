<template>
  <div class="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
    <Header />
    <section
      class="w-full grow px-3 md:w-5/6 lg:max-w-7xl min-h-full h-auto flex flex-col justify-start items-center self-center"
    >
      <p
        class="mt-12 p-8 text-4xl font-bold text-dark"
        style="font-family: 'xkcd'"
      >
        Star History Blog
      </p>
      <div
        v-if="state.isLoading"
        class="grow w-full flex flex-col justify-center items-center"
      >
        <i class="fas fa-spinner animate-spin text-4xl z-10"></i>
      </div>
      <div
        v-else-if="state.featuredBlogs.length + state.blogs.length === 0"
        class="w-full h-10 flex flex-col justify-center items-center"
      >
        <p class="text-center leading-8 text-lg text-dark font-medium">
          Oops! No article found.
        </p>
      </div>
      <div v-else class="w-full flex flex-col justify-start items-center">
        <!-- Featured blogs -->
        <div class="w-full mt-8 flex flex-col justify-start items-start">
          <div
            v-for="blog in state.featuredBlogs"
            :key="blog.slug"
            class="w-full h-auto flex flex-col border rounded-md mb-6 shadow-lg"
          >
            <router-link :to="{ path: `/blog/${blog.slug}` }">
              <img
                class="h-60 w-full flex-shrink-0 object-cover rounded-t-md"
                :src="blog.featureImage"
              />
            </router-link>
            <div class="w-full p-6 py-4 flex flex-col justify-start">
              <div class="mt-2 w-full flex flex-col justify-start items-start">
                <router-link :to="{ path: `/blog/${blog.slug}` }">
                  <p class="text-xl font-semibold text-dark">
                    {{ blog.title }}
                  </p>
                </router-link>
                <p class="mt-3 text-base text-gray-500 line-clamp-3">
                  {{ blog.excerpt }}
                </p>
              </div>
              <div class="mt-3 flex flex-row justify-start items-center">
                <p class="flex space-x-1 text-sm text-gray-500">
                  <span class="text-sm font-medium text-gray-900">
                    {{ blog.author }}
                  </span>
                  <span aria-hidden="true"> &middot; </span>
                  <time :datetime="blog.publishedDate">
                    {{
                      new Date(blog.publishedDate).toLocaleString("default", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  </time>
                  <span aria-hidden="true"> &middot; </span>
                  <span> {{ blog.readingTime }} </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Normal blogs -->
        <div class="w-full flex flex-col justify-start items-start grow mb-16">
          <div
            v-for="blog in state.blogs"
            :key="blog.slug"
            class="w-full h-auto flex flex-col-reverse justify-start lg:flex-row lg:justify-between border rounded-md mb-4"
          >
            <div
              class="p-6 pr-4 w-full flex flex-col justify-start items-start"
            >
              <div class="w-full flex flex-col justify-start items-start">
                <router-link :to="{ path: `/blog/${blog.slug}` }">
                  <p class="text-xl font-semibold text-dark">
                    {{ blog.title }}
                  </p>
                </router-link>
                <p
                  class="w-full mt-3 text-base text-gray-500 break-words line-clamp-3"
                >
                  {{ blog.excerpt }}
                </p>
              </div>
              <div class="grow"></div>
              <div class="flex flex-row justify-start items-center">
                <p class="flex ml-2 space-x-1 text-sm text-gray-500">
                  <span class="text-sm ml-2 font-medium text-gray-900">
                    {{ blog.author }}
                  </span>
                  <span aria-hidden="true"> &middot; </span>
                  <time :datetime="blog.publishedDate">
                    {{
                      new Date(blog.publishedDate).toLocaleString("default", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    }}
                  </time>
                  <span aria-hidden="true"> &middot; </span>
                  <span> {{ blog.readingTime }} </span>
                </p>
              </div>
            </div>
            <img
              v-if="blog.featureImage"
              class="shrink-0 w-full h-60 object-cover rounded-t-md lg:w-auto lg:h-auto lg:max-h-full lg:max-w-xs lg:m-2 lg:rounded-md"
              :src="blog.featureImage"
            />
          </div>
        </div>
      </div>
    </section>
    <BytebaseBanner v-if="!state.isLoading" class="mb-8"></BytebaseBanner>
    <Footer />

    <SponsorBanner />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";
import utils from "../../common/utils";
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import BytebaseBanner from "../components/BytebaseBanner.vue";
import SponsorBanner from "../components/SponsorBanner.vue";

interface State {
  isLoading: boolean;
  blogs: Blog[];
  featuredBlogs: Blog[];
}

const state = reactive<State>({
  isLoading: true,
  blogs: [],
  featuredBlogs: [],
});

onMounted(async () => {
  const res = await fetch("/blog/data.json");
  const rawBlogList = (await res.json()) as Blog[];
  const blogList: Blog[] = [];
  for (const raw of rawBlogList) {
    const contentRes = await fetch(`/blog/${raw.slug}.md`);
    const content = await contentRes.text();
    blogList.push({
      ...raw,
      readingTime: utils.calcReadingTime(content),
    });
  }

  const featuredBlogs = blogList.filter((blog) => blog.featured);
  const blogs = blogList.filter((blog) => !blog.featured);
  state.featuredBlogs = featuredBlogs;
  state.blogs = blogs;

  state.isLoading = false;
});
</script>
