<template>
  <div
    class="w-full px-3 max-w-3xl mx-auto flex flex-col justify-center items-center text-center"
  >
    <div class="w-full mb-6 flex flex-col justify-center items-center">
      <p class="mb-2 text-sm text-gray-600">
        <a
          class="text-blue-500 hover:opacity-80 underline"
          :href="randomSponsors[0].link"
          target="_blank"
        >
          {{ randomSponsors[0].name }}
        </a>
        - {{ randomSponsors[0].landingSlogan }}
      </p>
      <a
        class="hover:opacity-80"
        :href="randomSponsors[0].link"
        target="_blank"
      >
        <img
          class="w-auto max-w-full"
          :src="randomSponsors[0].landingImage"
          :alt="randomSponsors[0].name"
        />
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { randomSponsors } from "../helpers/sponsor";
</script>
