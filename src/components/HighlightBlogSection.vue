<template>
  <div class="flex flex-col justify-start items-start w-full mt-12 p-4 pl-8">
    <template v-for="section in blogSectionList" :key="section.title">
      <div class="w-full flex flex-row justify-between items-center my-2">
        <h3 class="text-sm font-medium text-gray-400 leading-6">
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
            class="inline -ml-2 text-sm text-blue-700 hover:underline"
            >{{ blog.title }}</a
          >
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts" setup>
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
        title: "2023 Jan",
        slug: "star-history-monthly-pick-202301",
      },
      {
        title: "2022 Dec",
        slug: "star-history-monthly-pick-202212",
      },
    ],
  },
];
</script>
