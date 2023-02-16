<template>
  <a
    class="border rounded flex flex-row justify-start items-center text-black text-xs bg-white shadow-inner hover:opacity-80"
    href="https://github.com/star-history/star-history"
    target="_blank"
    aria-label="Star star-history/star-history on GitHub"
  >
    <span
      class="pr-1 pl-2 h-full flex flex-row justify-center items-center bg-gray-100 border-r font-medium"
    >
      <i class="fab fa-github text-base mr-1 -mt-px"></i>
      <span class="mt-px">Star</span>
    </span>
    <div class="h-full block px-2 mt-px font-medium">
      <span v-if="starCount === 0">
        <i class="fa fa-spinner animate-spin opacity-90 px-2"></i>
      </span>
      <span v-else>{{ starCount }}</span>
    </div>
  </a>
</template>

<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const starCount = ref(0);

const getRepoStarCount = async () => {
  const { data } = await axios.get(
    `https://api.github.com/repos/star-history/star-history`,
    {
      headers: {
        Accept: "application/vnd.github.v3.star+json",
        Authorization: "",
      },
    }
  );
  return data.stargazers_count as number;
};

onMounted(async () => {
  starCount.value = await getRepoStarCount();
});
</script>
