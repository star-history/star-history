<template>
  <div
    class="w-full px-3 max-w-2xl mx-auto flex flex-col justify-center items-center mb-14"
  >
    <p class="leading-8 mb-3">
      You can include the chart into your repository's
      <span class="font-mono font-bold text-gray-500">README.md</span> with the
      following code:
    </p>
    <div class="w-full bg-gray-100 text-dark rounded-md shadow">
      <pre class="w-full p-4 font-mono break-all whitespace-pre-wrap text-sm">{{
        embedCode
      }}</pre>
      <p
        class="w-full text-center py-4 bg-gray-600 text-light font-mono rounded-b-md cursor-pointer hover:bg-gray-700"
        @click="handleCopyBtnClick"
      >
        Copy
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
const embedCode = computed(() => {
  return `## Star History

[![Star History Chart](https://sh-svg.onrender.com/svg?repos=${store.repos.join(
    ","
  )}&type=${store.chartMode})](${window.location.href})
`;
});

const handleCopyBtnClick = () => {
  utils.copyTextToClipboard(embedCode.value);
  toast.succeed("Embed code copied");
};
</script>
