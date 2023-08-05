<template>
  <div
    class="fixed right-0 top-32 hidden lg:flex flex-col justify-start items-start transition-all bg-white w-48 xl:w-56 p-2 z-50"
    :class="state.hide && '!hidden'"
  >
    <div class="w-full flex flex-row justify-between items-center mb-2">
      <span class="text-xs text-gray-400">SPONSORS</span>
      <i
        class="fas fa-times text-xs text-gray-400 cursor-pointer hover:text-gray-500"
        @click.prevent="handleCloseButtonClick"
      ></i>
    </div>
    <template v-for="sponsor in randomSponsors" :key="sponsor.name">
      <a
        :href="sponsor.link"
        class="bg-gray-50 p-2 rounded w-full flex flex-col justify-center items-center mb-2 text-zinc-600 hover:opacity-80 hover:text-blue-600 hover:underline"
        target="_blank"
      >
        <img
          class="w-auto max-w-full"
          :src="sponsor.logo"
          :alt="sponsor.name"
        />
        <span class="text-xs mt-2">{{ sponsor.slogan }}</span>
      </a>
    </template>
    <a
      href="mailto:star@bytebase.com?subject=I'm interested in sponsoring star-history.com"
      target="_blank"
      class="w-full p-2 text-center bg-gray-50 text-xs leading-6 text-gray-400 rounded hover:underline hover:text-blue-600"
      >Your logo</a
    >
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { randomSponsors } from "../helpers/sponsor";

const state = reactive({
  hide: false,
});

const handleCloseButtonClick = () => {
  state.hide = true;
};
</script>
