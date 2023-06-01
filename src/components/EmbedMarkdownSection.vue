<template>
  <div
    class="w-full h-auto mb-16 px-3 mx-auto max-w-4xl flex flex-col justify-start items-center"
  >
    <p class="leading-8 mb-3">
      🌟 Show real-time chart on
      {{ repoText }}
      <a
        v-if="singleRepo"
        class="font-mono font-bold underline text-blue-500 hover:opacity-80"
        :href="`https://github.com/${singleRepo}/blob/master/README.md`"
        target="_blank"
        >README.md</a
      >
      <span v-else class="font-mono font-bold text-gray-500">README.md</span>
      with the following code (<a
        class="font-mono font-bold underline text-blue-500 hover:opacity-80"
        :href="`https://github.com/bytebase/bytebase#star-history`"
        target="_blank"
        >example</a
      >):
    </p>
    <div class="w-full bg-gray-100 text-dark rounded-md shadow">
      <pre class="w-full p-4 font-mono break-all whitespace-pre-wrap text-sm">{{
        embedCode
      }}</pre>
      <p
        class="w-full text-center py-4 bg-green-600 text-light font-mono rounded-b-md cursor-pointer hover:bg-green-700"
        @click="handleCopyBtnClick"
      >
        Copy to GitHub README.md
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import utils from "../../common/utils";
import toast from "../helpers/toast";
import useAppStore from "../store";

const store = useAppStore();
const singleRepo = computed(() => {
  if (store.repos.length === 1) {
    return store.repos[0];
  } else {
    return null;
  }
});
const repoText = computed(() => {
  if (singleRepo.value) {
    return singleRepo.value.split("/")[1];
  } else {
    return "your repository's";
  }
});

const embedCode = computed(() => {
  return `## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=${store.repos.join(
    ","
  )}&type=${store.chartMode})](${window.location.href})
`;
});

const handleCopyBtnClick = () => {
  utils.copyTextToClipboard(embedCode.value);
  toast.succeed("Embed markdown code copied");
};
</script>
