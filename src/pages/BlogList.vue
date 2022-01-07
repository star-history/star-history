<template>
  <div class="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
    <Header />
    <section
      class="w-full px-4 md:w-5/6 lg:max-w-7xl h-full flex flex-col justify-start items-center self-center"
    >
      <p class="pt-8">Star History Blog</p>
      <!-- Featured posts -->
      <div class="w-full mt-12 flex flex-col justify-start items-start">
        <router-link
          v-for="post in state.featuredPosts"
          :key="post.slug"
          :to="{ path: `/blog/${post.slug}` }"
          class="w-full h-auto flex flex-col border mb-4"
        >
          <img
            class="h-60 w-full flex-shrink-0 object-cover"
            :src="post.feature_image || ''"
            :alt="post.feature_image_alt || ''"
          />
          <div class="w-full p-6 flex flex-col justify-start">
            <div class="w-full flex flex-row justify-start items-center">
              <span
                v-for="tag in post.tags"
                :key="tag.id"
                class="items-center px-3 py-0.5 mr-2 rounded-full text-sm font-medium"
              >
                {{ tag.name }}
              </span>
            </div>
            <div class="mt-2 w-full flex flex-col justify-start items-start">
              <p class="text-xl font-semibold text-dark">
                {{ post.title }}
              </p>
              <p class="mt-3 text-base text-gray-500">
                {{ post.excerpt }}
              </p>
            </div>
            <div class="mt-6 flex flex-row justify-start items-center">
              <img
                class="w-10 h-auto object-cover rounded-full flex-shrink-0"
                :src="post.authors![0].profile_image || ''"
                alt=""
              />
              <div class="ml-3 flex flex-col justify-center items-start">
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
        </router-link>
      </div>
      <!-- Normal posts -->
      <div class="w-full flex flex-col justify-start items-start grow mb-16">
        <router-link
          v-for="post in state.posts"
          :key="post.slug"
          :to="{ path: `/blog/${post.slug}` }"
          class="w-full h-auto flex flex-row justify-between border mb-4"
        >
          <div class="p-6 flex flex-col justify-start items-start shrink">
            <div class="w-full flex flex-col justify-start items-start">
              <p class="text-xl font-semibold text-dark">
                {{ post.title }}
              </p>
              <p
                class="mt-3 text-base text-gray-500"
                style="word-break: break-word"
              >
                {{ post.excerpt }}
              </p>
            </div>
            <div
              class="mt-6 mb-2 w-full flex flex-row justify-start items-center"
            >
              <span
                v-for="tag in post.tags"
                :key="tag.id"
                class="items-center px-3 py-0.5 mr-2 rounded-full text-sm font-medium"
              >
                {{ tag.name }}
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
            class="shrink-0 h-auto max-h-full w-auto max-w-xs p-2 object-cover"
            :src="post.feature_image || ''"
            :alt="post.feature_image_alt || ''"
          />
        </router-link>
      </div>
    </section>
    <div class="grow py-6"></div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { PostOrPage } from "@tryghost/content-api";
import { defineComponent, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import api from "../helpers/api";

interface State {
  featuredPosts: PostOrPage[];
  posts: PostOrPage[];
}

export default defineComponent({
  name: "BlogList",
  components: { Footer, Header },
  setup: () => {
    const state = reactive<State>({
      featuredPosts: [],
      posts: [],
    });
    const currentRoute = useRoute();
    console.log(currentRoute.name);

    onMounted(async () => {
      try {
        const posts = await api.getPosts();
        for (const p of posts) {
          if (p.featured) {
            state.featuredPosts.push(p);
          } else {
            // TODO: Filter post with tags?
            state.posts.push(p);
          }
        }
      } catch (error) {
        // do nth
      }
    });

    return {
      state,
    };
  },
});
</script>
