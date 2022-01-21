<template>
  <div class="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
    <Header />
    <div
      class="w-full p-4 md:p-0 mt-6 md:w-5/6 lg:max-w-6xl h-full flex flex-col justify-start items-center self-center"
    >
      <img
        class="hidden md:block w-auto max-w-full object-scale-down"
        :src="state.post?.feature_image || ''"
        :alt="state.post?.feature_image_alt || ''"
      />
      <!-- title -->
      <div
        class="w-auto max-w-6xl mt-4 md:mt-12 prose prose-indigo prose-xl md:prose-2xl flex flex-col justify-center items-center"
      >
        <h1 class="leading-16">
          {{ state.post?.title }}
        </h1>
      </div>
      <!-- author information -->
      <div
        v-show="state.post"
        class="w-full mt-8 mb-2 max-w-6xl px-2 flex flex-row items-center justify-center text-sm text-gray-900 font-semibold tracking-wide uppercase"
      >
        <img
          class="h-8 w-auto rounded-full mr-2"
          :src="state.post?.authors![0].profile_image || ''"
        />{{ state.post?.authors![0].name }}
        <div class="ml-2 flex space-x-1 text-gray-500">
          <time :datetime="state.post?.published_at || ''">
            {{
              new Date(state.post?.published_at || "").toLocaleString(
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
          <span> {{ state.post?.reading_time }} min read </span>
        </div>
      </div>
      <!-- blog tags -->
      <div
        class="mb-8 w-full max-w-6xl flex flex-row justify-center items-center"
      >
        <span
          v-for="tag in state.post?.tags"
          :key="tag.id"
          class="items-center px-3 py-0.5 mr-2 rounded-full text-base"
        >
          # {{ tag.name }}
        </span>
      </div>
      <div
        class="w-full max-w-5xl prose prose-indigo prose-xl md:prose-2xl"
        v-html="state.post?.html"
      ></div>
      <div
        v-if="!state.isLoading && state.post === undefined"
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
    <div class="grow my-6"></div>
    <SubscribeSection />
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
import SubscribeSection from "../components/SubscribeSection.vue";

interface State {
  isLoading: boolean;
  post?: PostOrPage;
}

export default defineComponent({
  name: "Blog",
  components: { Footer, Header, SubscribeSection },
  setup: () => {
    const state = reactive<State>({
      isLoading: true,
    });
    const currentRoute = useRoute();

    onMounted(async () => {
      const blogSlug = currentRoute.params.blogSlug as string;

      if (!blogSlug) {
        return;
      }

      try {
        const post = await api.getPostDetailBySlug(blogSlug);
        state.post = post;
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
