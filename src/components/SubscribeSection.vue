<template>
  <div
    class="w-auto max-w-lg mx-3 border self-center rounded-md p-6 flex flex-col sm:w-full"
  >
    <div class="text-left">
      <h2 class="text-2xl font-extrabold text-gray-800 sm:text-3xl">
        Never miss a thing
      </h2>
      <p class="mt-2 text-lg text-gray-500">
        Subscribe to our newsletter about open source
      </p>
    </div>
    <div class="mt-4">
      <div v-if="subscribed" class="text-lg font-semibold text-green-600">
        <span class="text-2xl mr-2">🙌</span> Now check {{ email }} to confirm
        the subscription.
      </div>
      <form v-else class="sm:flex" @submit.prevent="handleSubscribeBtnClick">
        <label for="email-address" class="sr-only">Email address</label>
        <input
          id="email-address"
          v-model="email"
          name="email-address"
          type="email"
          autocomplete="email"
          required
          class="w-full outline-none border shadow-inner p-2 px-3 text-base rounded-md focus:shadow-focus"
          placeholder="Enter your email"
        />
        <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
          <button
            type="submit"
            class="w-full px-4 py-2 h-full text-base rounded-md bg-green-500 shadow-inner text-light hover:bg-green-600"
          >
            Subscribe
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import api from "../helpers/api";

export default defineComponent({
  setup() {
    const email = ref("");
    const subscribed = ref(false);

    const handleSubscribeBtnClick = async () => {
      try {
        await api.subscribeBlog(email.value);
      } catch (error) {
        // do nth
      }
      subscribed.value = true;
    };

    return {
      email,
      subscribed,
      handleSubscribeBtnClick,
    };
  },
});
</script>
