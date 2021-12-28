<template>
  <footer
    class="relative w-full shrink-0 h-auto mt-6 flex flex-col justify-end items-center"
  >
    <div
      class="w-full py-2 px-3 md:w-5/6 lg:max-w-7xl flex flex-row flex-wrap justify-between items-center text-neutral-700 border-t"
    >
      <div
        class="text-sm leading-8 flex flex-row flex-wrap justify-start items-center"
      >
        <span class="h-full">The missing GitHub star history graph</span>
        <a
          class="h-full flex flex-row justify-center items-center mx-3 text-lg hover:opacity-80"
          href="mailto:star@bytebase.com"
          target="_blank"
        >
          <i class="fas fa-envelope"></i>
        </a>
        <a
          class="h-full flex flex-row justify-center items-center mr-3 text-lg hover:opacity-80"
          href="https://github.com/bytebase/star-history"
          target="_blank"
        >
          <i class="fab fa-github"></i>
        </a>
        <span></span>
        <a
          class="h-full flex flex-row justify-center items-center hover:opacity-80"
          href="https://chrome.google.com/webstore/detail/iijibbcdddbhokfepbblglfgdglnccfn"
          target="_blank"
        >
          <i class="fab fa-chrome text-lg mr-1"></i>
          <span class="font-bold leading-6">Chrome Extension</span>
          <img class="w-4 h-auto ml-1" src="/icons/free.svg" />
        </a>
      </div>
      <div
        class="text-xs leading-8 flex flex-row flex-nowrap justify-end items-center"
      >
        <span class="">
          Sponsored by
          <a
            class="text-blue-500 font-bold hover:opacity-80"
            href="https://bytebase.com"
            target="_blank"
          >
            Bytebase
          </a>
          , originally built by
          <a
            class="bg-blue-400 text-white p-1 pl-2 pr-2 rounded-l-2xl rounded-r-2xl hover:opacity-80"
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
