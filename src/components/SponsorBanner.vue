<template>
  <div
    class="fixed right-0 top-32 hidden lg:flex flex-col justify-start items-start transition-all bg-white w-48 xl:w-64 shadow p-4 rounded z-50"
    :class="state.hide && '!hidden'"
  >
    <div class="w-full flex flex-row justify-between items-center mb-2 -mt-2">
      <span class="text-xs font-medium text-gray-400">SPONSORS</span>
      <i
        class="fas fa-times text-base text-gray-400 cursor-pointer hover:text-gray-500"
        @click.prevent="handleCloseButtonClick"
      ></i>
    </div>
    <a
      class="relative flex flex-col bg-gray-50 p-2 rounded justify-center items-center text-zinc-600 hover:opacity-80 hover:text-blue-600 hover:underline"
      href="https://bytebase.com/"
      target="_blank"
    >
      <img
        class="w-auto max-w-full rounded"
        src="/imgs/ads.png"
        alt="bytebase"
      />
      <p class="mt-2 text-xs">
        Database DevOps and CI/CD for MySQL, PG, ClickHouse, Snowflake, TiDB,
        MongoDB and Spanner
      </p>
    </a>
    <a
      href="mailto:star@bytebase.com?subject=I'm interested in sponsoring star-history.com"
      target="_blank"
      class="w-full mt-2 p-2 text-center bg-gray-50 text-xs leading-6 text-gray-400 rounded hover:underline hover:text-blue-600"
      >Your logo</a
    >
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
</script>
