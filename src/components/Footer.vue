<template>
  <footer
    class="w-full shrink-0 h-14 mt-6 flex flex-row justify-center items-center"
  >
    <div
      class="w-5/6 min-w-2xl max-w-full h-full flex flex-row justify-between items-center border-t"
    >
      <div class="flex flex-row text-sm justify-start items-center">
        <span class="">The missing GitHub star history graph</span>
        <a
          class="ml-3 text-lg hover:opacity-60"
          href="https://twitter.com/StarHistoryHQ"
        >
          <i class="fab fa-twitter"></i>
        </a>
        <a
          class="ml-3 text-lg hover:opacity-60"
          href="mailto:star@bytebase.com"
        >
          <i class="fas fa-envelope"></i>
        </a>
        <a
          class="ml-3 text-lg hover:opacity-60"
          href="https://github.com/bytebase/star-history"
        >
          <i class="fab fa-github"></i>
        </a>
      </div>
      <div class="flex flex-row justify-end items-center">
        <span class="text-sm">
          Sponsored by
          <a
            class="text-cyan-700 font-bold hover:opacity-60"
            href="https://bytebase.com"
            target="__blank"
          >
            Bytebase
          </a>
          , originally built by
          <a
            class="bg-cyan-500 text-white p-1 pl-2 pr-2 rounded-l-2xl rounded-r-2xl hover:opacity-60"
            href="https://twitter.com/tim_qian"
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
