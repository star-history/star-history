<template>
  <div
    class="fixed left-0 top-32 hidden lg:flex flex-col justify-start items-start transition-all bg-white w-48 xl:w-56 shadow p-4 pb-2 rounded z-50"
    :class="state.hide && '!hidden'"
  >
    <div class="z-10 w-full flex flex-row justify-end items-center mb-2 -mt-2">
      <i
        class="fas fa-times text-base text-gray-400 cursor-pointer hover:text-gray-500"
        @click.prevent="handleCloseButtonClick"
      ></i>
    </div>
    <p class="-mt-10"></p>
    <template v-for="section in blogSectionList" :key="section.title">
      <div class="w-full flex flex-row justify-between items-center my-2">
        <h3 class="text-xs font-medium text-gray-400 leading-6">
          {{ section.title }}
        </h3>
      </div>
      <ul class="list-disc list-inside">
        <li
          v-for="blog in section.blogList"
          :key="blog.title"
          class="mb-2 leading-3"
        >
          <a
            :href="'/blog/' + blog.slug"
            class="inline -ml-2 text-sm text-blue-600 hover:underline"
            >{{ blog.title }}</a
          >
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

const state = reactive({
  hide: false,
});

const handleCloseButtonClick = () => {
  state.hide = true;
};

const blogSectionList = [
  {
    title: "Best of 2022",
    blogList: [
      {
        title: "Open-Source Alternatives",
        slug: "star-history-open-source-2022-open-source-alternatives",
      },
      {
        title: "Platform Engineering",
        slug: "star-history-open-source-2022-platform-engineering",
      },
      {
        title: "Data, Infra & DevTools",
        slug: "star-history-yearly-pick-2022-data-infra-devtools",
      },
      {
        title: "Front-end",
        slug: "star-history-yearly-pick-2022-frontend",
      },
    ],
  },
  {
    title: "Monthly Pick",
    blogList: [
      {
        title: "2022 Dec",
        slug: "star-history-monthly-pick-202212",
      },
    ],
  },
];
</script>
