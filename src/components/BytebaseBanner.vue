<template>
  <div
    class="w-full px-3 max-w-2xl mx-auto flex flex-col justify-center items-center"
  >
    <p class="font-bold mb-4">
      Sponsored by
      <a class="text-blue-500" href="https://bytebase.com" target="__blank">
        Bytebase
      </a>
    </p>
    <p class="mb-2">
      Open source, web-based database schema change and version control for
      <span class="font-bold text-blue-500 underline">Teams</span>
    </p>
    <a class="mt-2" href="https://bytebase.com/" target="__blank">
      <img class="w-auto max-w-full" src="/bytebase.webp" alt="bytebase" />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BytebaseBanner",
});
</script>
