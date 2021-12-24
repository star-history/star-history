<template>
  <div class="w-full leading-8 flex grow flex-col justify-center items-center">
    <p class="font-bold">
      Sponsored by
      <a class="text-cyan-700" href="https://bytebase.com" target="__blank">
        Bytebase
      </a>
    </p>
    <p>
      Open source, web-based database schema change and version control for
      <span class="font-bold text-cyan-700 underline">Teams</span>
    </p>
    <a class="mt-2 shadow-xl" href="https://bytebase.com/" target="__blank">
      <img class="w-auto max-w-2xl" src="/bytebase.webp" alt="bytebase" />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BytebaseBanner",
});
</script>
