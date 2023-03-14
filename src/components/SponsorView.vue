<template>
  <div
    class="w-full px-3 max-w-4xl mx-auto flex lg:hidden flex-col justify-center items-center"
  >
    <p
      class="relative flex flex-row justify-center items-center mb-2 font-semibold"
    >
      <span>
        Sponsored by
        <template v-for="sponsor in randomSponsors" :key="sponsor.name">
          <a
            class="text-blue-500 hover:opacity-80 underline"
            :href="sponsor.link"
            target="_blank"
          >
            {{ sponsor.name }}
          </a>
          <span class="last:hidden mx-1">&</span>
        </template>
      </span>
    </p>
    <div
      v-for="sponsor in randomSponsors"
      :key="sponsor.name"
      class="w-full mb-6 flex flex-col justify-center items-center"
    >
      <p class="mb-2 text-sm sm:text-base text-gray-600">
        {{ sponsor.slogan }}
      </p>
      <a class="hover:opacity-80" :href="sponsor.link" target="_blank">
        <img
          class="w-auto max-w-full"
          :src="sponsor.landingImage"
          :alt="sponsor.name"
        />
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { randomSponsors } from "../helpers/sponsor";
</script>
