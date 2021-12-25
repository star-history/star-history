<template>
  <header
    class="w-full h-52px shrink-0 flex flex-row justify-center items-center bg-dark text-light"
  >
    <div
      class="w-full pr-4 md:w-5/6 md:pr-0 lg:max-w-7xl h-full flex flex-row justify-between items-center"
    >
      <div class="h-full flex flex-row justify-start items-center">
        <a
          class="h-full flex flex-row justify-center items-center p-3 m-1 hover:bg-black"
          href="/"
          ><img class="w-7 h-auto" src="/icon.png"
        /></a>
        <span class="font-bold text-white">Star history</span>
      </div>
      <div class="flex flex-row justify-end items-center">
        <span class="h-6 flex flex-row justify-center items-center mt-1.5">
          <a
            class="github-button"
            href="https://github.com/bytebase/star-history"
            data-show-count="true"
            aria-label="Star bytebase/star-history on GitHub"
          >
            Star
          </a>
        </span>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Header",
  setup() {
    return {};
  },
});
</script>
