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
          v-for="blog in section.linkList"
          :key="blog.title"
          class="mb-2 leading-3 cursor-pointer"
          @click="clickLink(blog.path)"
        >
          <span class="inline -ml-2 text-sm text-blue-700 hover:underline">
            {{ blog.title }}
          </span>
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts" setup>
const blogSectionList = [
  {
    title: "Best of 2022",
    linkList: [
      {
        title: "Open-Source Alternatives",
        path: "https://star-history.com/blog/star-history-open-source-2022-open-source-alternatives",
      },
      {
        title: "Platform Engineering",
        path: "https://star-history.com/blog/star-history-open-source-2022-platform-engineering",
      },
      {
        title: "Data, Infra & DevTools",
        path: "https://star-history.com/blog/star-history-yearly-pick-2022-data-infra-devtools",
      },
      {
        title: "Front-end",
        path: "https://star-history.com/blog/star-history-yearly-pick-2022-frontend",
      },
    ],
  },
  {
    title: "Monthly Pick",
    linkList: [
      {
        title: "2023 Jan",
        path: "https://star-history.com/blog/star-history-monthly-pick-202301",
      },
      {
        title: "2022 Dec",
        path: "https://star-history.com/blog/star-history-monthly-pick-202212",
      },
    ],
  },
  {
    title: "Collections",
    linkList: [
      {
        title: "AI Model",
        path: "https://star-history.com/#CompVis/stable-diffusion&lllyasviel/ControlNet&openai/whisper&facebookresearch/llama",
      },
      {
        title: "Database DevOps",
        path: "https://star-history.com/#bytebase/bytebase&liquibase/liquibase&flyway/flyway",
      },
      {
        title: "Workflow Orchestration",
        path: "https://star-history.com/#temporalio/temporal&apache/dolphinscheduler&apache/airflow&quartz-scheduler/quartz",
      },
    ],
  },
];

const clickLink = (link: string) => {
  window.open(link, "_self");
};
</script>
