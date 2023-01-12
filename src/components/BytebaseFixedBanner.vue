<template>
  <div
    class="fixed right-0 top-1/2 -translate-y-1/2 hidden sm:block"
    :class="state.hide && '!hidden'"
  >
    <a
      class="relative bg-white w-64 flex flex-col justify-center items-center shadow p-4 rounded text-zinc-600 hover:opacity-90 hover:text-blue-600 hover:underline"
      href="https://bytebase.com/"
      target="_blank"
    >
      <i
        class="fas fa-times-circle text-xl text-gray-400 cursor-pointer absolute -top-2 -left-2 hover:text-gray-500"
        @click.prevent="handleCloseButtonClick"
      ></i>
      <img class="w-auto max-w-full" src="/imgs/ads.png" alt="bytebase" />
      <p class="mt-2 text-sm">
        Database DevOps and CI/CD for MySQL, PG, ClickHouse, Snowflake, TiDB
      </p>
    </a>
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
