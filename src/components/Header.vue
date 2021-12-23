<template>
  <header
    class="w-full h-14 shrink-0 flex flex-row justify-center items-center bg-zinc-800"
  >
    <div
      class="w-5/6 min-w-2xl max-w-full flex flex-row justify-between items-center"
    >
      <div class="flex flex-row justify-start items-center">
        <img class="w-6 h-auto mr-4" src="/icon.png" />
        <span class="text-lg font-bold text-white">Star history</span>
      </div>
      <div class="flex flex-row justify-end items-center">
        <span
          class="h-6 flex flex-row justify-center items-center mt-1.5 text-blue-400"
        >
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
