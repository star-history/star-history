<template>
  <footer
    class="w-full shrink-0 h-auto mt-6 flex flex-row justify-center items-center"
  >
    <div
      class="w-full py-2 px-3 md:w-5/6 lg:max-w-7xl flex flex-row flex-wrap justify-between items-center text-neutral-700 border-t"
    >
      <div
        class="text-sm leading-8 flex flex-row flex-nowrap justify-start items-center"
      >
        <span class="">The missing GitHub star history graph</span>
        <a
          class="ml-3 text-lg hover:opacity-60"
          href="https://twitter.com/StarHistoryHQ"
          target="_blank"
        >
          <i class="fab fa-twitter"></i>
        </a>
        <a
          class="ml-3 text-lg hover:opacity-60"
          href="mailto:star@bytebase.com"
          target="_blank"
        >
          <i class="fas fa-envelope"></i>
        </a>
        <a
          class="mx-3 text-lg hover:opacity-60"
          href="https://github.com/bytebase/star-history"
          target="_blank"
        >
          <i class="fab fa-github"></i>
        </a>
      </div>
      <div
        class="text-sm leading-8 flex flex-row flex-nowrap justify-end items-center"
      >
        <span class="">
          Sponsored by
          <a
            class="text-blue-500 font-bold hover:opacity-60"
            href="https://bytebase.com"
            target="_blank"
          >
            Bytebase
          </a>
          , originally built by
          <a
            class="bg-blue-400 font-bold text-white p-1 pl-2 pr-2 rounded-l-2xl rounded-r-2xl hover:opacity-60"
            href="https://twitter.com/tim_qian"
            target="_blank"
          >
            @tim_qian
          </a>
        </span>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Footer",
  setup() {
    return {};
  },
});
</script>
