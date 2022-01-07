<template>
  <div class="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
    <Header />
    <div
      class="w-full p-4 md:p-0 mt-6 md:w-5/6 lg:max-w-7xl h-full flex flex-col justify-start items-center self-center"
    >
      <img
        class="hidden md:block w-full object-scale-down"
        :src="state.post?.feature_image || ''"
        :alt="state.post?.feature_image_alt || ''"
      />
      <!-- title -->
      <div
        class="w-full max-w-6xl mt-12 prose prose-indigo prose-xl md:prose-2xl flex flex-row justify-center items-center"
      >
        <h1 class="leading-16">
          {{ state.post?.title }}
        </h1>
      </div>
      <!-- tags -->
      <div
        class="px-4 mt-6 w-full max-w-6xl flex flex-row justify-center items-center"
      >
        <span
          v-for="tag in state.post?.tags"
          :key="tag.id"
          class="items-center px-3 py-0.5 mr-2 rounded-full text-base font-medium"
        >
          # {{ tag.name }}
        </span>
      </div>
      <!-- author infomartion -->
      <div
        class="w-full mt-2 mb-4 max-w-6xl px-2 flex flex-row items-center justify-center text-sm text-gray-900 font-semibold tracking-wide uppercase"
      >
        <img
          class="h-8 w-auto rounded-full mr-2"
          :src="state.post?.authors![0].profile_image || ''"
        />{{ state.post?.authors![0].name }}
        <div class="flex space-x-1 text-gray-500">
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
      <div
        class="w-full max-w-5xl prose prose-indigo prose-xl md:prose-2xl"
        v-html="state.post?.html"
      ></div>
    </div>
    <div class="grow my-6"></div>
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
  post?: PostOrPage;
}

export default defineComponent({
  name: "Blog",
  components: { Footer, Header },
  setup: () => {
    const state = reactive<State>({});
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
    });

    return {
      state,
    };
  },
});
</script>
