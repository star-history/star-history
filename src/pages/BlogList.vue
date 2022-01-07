<template>
  <div class="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
    <Header />
    <section
      class="w-full px-4 md:w-5/6 lg:max-w-7xl min-h-full h-auto flex flex-col justify-start items-center self-center"
    >
      <p
        class="mt-12 p-8 text-4xl font-bold text-dark"
        style="font-family: 'xkcd'"
      >
        Star History Blog
      </p>
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
              <p class="mt-3 text-base text-gray-500">
                {{ post.excerpt }}
              </p>
              <div class="w-full mt-2 flex flex-row justify-start items-center">
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
          <div class="p-6 pr-4 w-full flex flex-col justify-start items-start">
            <div class="w-full flex flex-col justify-start items-start">
              <router-link :to="{ path: `/blog/${post.slug}` }">
                <p class="text-xl font-semibold text-dark">
                  {{ post.title }}
                </p>
              </router-link>
              <p class="w-full mt-3 text-base text-gray-500 break-words">
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
      <div
        v-if="
          !state.isLoading &&
          state.featuredPosts.length + state.posts.length === 0
        "
        class="w-full h-10 flex flex-col justify-center items-center"
      >
        <p class="text-center leading-8 text-lg text-dark font-medium">
          Oops, no article found. <br />
          Wait a moment please, I'm calling our excellent writer.
        </p>
      </div>
    </section>
    <div class="grow py-6"></div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { PostOrPage } from "@tryghost/content-api";
import { defineComponent, onMounted, reactive } from "vue";
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import api from "../helpers/api";

interface State {
  isLoading: boolean;
  featuredPosts: PostOrPage[];
  posts: PostOrPage[];
}

export default defineComponent({
  name: "BlogList",
  components: { Footer, Header },
  setup: () => {
    const state = reactive<State>({
      isLoading: true,
      featuredPosts: [],
      posts: [],
    });

    onMounted(async () => {
      try {
        const tags = ["StarHistory"];
        const posts = await api.getPosts(tags);
        for (const p of posts) {
          if (p.featured) {
            state.featuredPosts.push(p);
          } else {
            state.posts.push(p);
          }
        }
      } catch (error) {
        // do nth
      }
      state.isLoading = false;
    });

    return {
      state,
    };
  },
});
</script>
