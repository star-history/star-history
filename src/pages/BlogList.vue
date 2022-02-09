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
        v-else-if="state.featuredPosts.length + state.posts.length === 0"
        class="w-full h-10 flex flex-col justify-center items-center"
      >
        <p class="text-center leading-8 text-lg text-dark font-medium">
          Oops! No article found.
        </p>
      </div>
      <div v-else class="w-full flex flex-col justify-start items-center">
        <!-- Featured posts -->
        <div class="w-full mt-8 flex flex-col justify-start items-start">
          <div
            v-for="post in state.featuredPosts"
            :key="post.slug"
            class="w-full h-auto flex flex-col border rounded-md mb-6 shadow-lg"
          >
            <router-link :to="{ path: `/blog/${post.slug}` }">
              <img
                class="h-60 w-full flex-shrink-0 object-cover rounded-t-md"
                :src="post.feature_image || ''"
                :alt="post.feature_image_alt || ''"
              />
            </router-link>
            <div class="w-full p-6 py-4 flex flex-col justify-start">
              <div class="mt-2 w-full flex flex-col justify-start items-start">
                <router-link :to="{ path: `/blog/${post.slug}` }">
                  <p class="text-xl font-semibold text-dark">
                    {{ post.title }}
                  </p>
                </router-link>
                <p class="mt-3 text-base text-gray-500 line-clamp-3">
                  {{ post.excerpt }}
                </p>
                <div
                  class="w-full mt-2 flex flex-row justify-start items-center"
                >
                  <span
                    v-for="tag in post.tags"
                    :key="tag.id"
                    class="items-center py-1 mr-3 rounded-full text-sm text-gray-500"
                  >
                    # {{ tag.name }}
                  </span>
                </div>
              </div>
              <div class="mt-3 flex flex-row justify-start items-center">
                <img
                  class="w-10 h-auto object-cover rounded-full flex-shrink-0"
                  :src="post.authors![0].profile_image || ''"
                  alt=""
                />
                <div class="ml-2 flex flex-col justify-center items-start">
                  <p class="text-sm font-medium text-gray-900">
                    {{ post.authors![0].name || "" }}
                  </p>
                  <p class="flex space-x-1 text-sm text-gray-500">
                    <time :datetime="post.published_at || ''">
                      {{
                        new Date(post.published_at || "").toLocaleString(
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
                    <span> {{ post.reading_time }} min read </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Normal posts -->
        <div class="w-full flex flex-col justify-start items-start grow mb-16">
          <div
            v-for="post in state.posts"
            :key="post.slug"
            class="w-full h-auto flex flex-col-reverse justify-start lg:flex-row lg:justify-between border rounded-md mb-4"
          >
            <div
              class="p-6 pr-4 w-full flex flex-col justify-start items-start"
            >
              <div class="w-full flex flex-col justify-start items-start">
                <router-link :to="{ path: `/blog/${post.slug}` }">
                  <p class="text-xl font-semibold text-dark">
                    {{ post.title }}
                  </p>
                </router-link>
                <p
                  class="w-full mt-3 text-base text-gray-500 break-words line-clamp-3"
                >
                  {{ post.excerpt }}
                </p>
              </div>
              <div class="grow"></div>
              <div
                class="mt-4 mb-2 w-full flex flex-row justify-start items-center"
              >
                <span
                  v-for="tag in post.tags"
                  :key="tag.id"
                  class="items-center py-0.5 mr-3 rounded-full text-sm text-gray-500"
                >
                  # {{ tag.name }}
                </span>
              </div>
              <div class="flex flex-row justify-start items-center">
                <img
                  class="w-8 h-auto object-cover rounded-full flex-shrink-0"
                  :src="post.authors![0].profile_image || ''"
                  alt=""
                />
                <p class="text-sm ml-2 font-medium text-gray-900">
                  {{ post.authors![0].name || "" }}
                </p>
                <p class="flex ml-2 space-x-1 text-sm text-gray-500">
                  <time :datetime="post.published_at || ''">
                    {{
                      new Date(post.published_at || "").toLocaleString(
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
                  <span> {{ post.reading_time }} min read </span>
                </p>
              </div>
            </div>
            <img
              v-if="post.feature_image"
              class="shrink-0 w-full h-60 object-cover rounded-t-md lg:w-auto lg:h-auto lg:max-h-full lg:max-w-xs lg:m-2 lg:rounded-md"
              :src="post.feature_image || ''"
              :alt="post.feature_image_alt || ''"
            />
          </div>
        </div>
      </div>
    </section>
    <SubscribeSection v-if="!state.isLoading" class="mt-4 mb-8" />
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { PostOrPage } from "@tryghost/content-api";
import { onMounted, reactive } from "vue";
import { getPosts } from "../helpers/ghost";
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import SubscribeSection from "../components/SubscribeSection.vue";

interface State {
  isLoading: boolean;
  featuredPosts: PostOrPage[];
  posts: PostOrPage[];
}

const state = reactive<State>({
  isLoading: true,
  featuredPosts: [],
  posts: [],
});

onMounted(async () => {
  try {
    const tags = ["StarHistory"];
    const posts = await getPosts(tags);

    for (const post of posts) {
      const formatedPost = {
        ...post,
        tags: post.tags?.filter((t) => t.name !== "StarHistory"),
      };

      if (formatedPost.featured) {
        state.featuredPosts.push(formatedPost);
      } else {
        state.posts.push(formatedPost);
      }
    }
  } catch (error) {
    // do nth
  }

  state.isLoading = false;
});
</script>
