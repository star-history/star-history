<template>
  <Dialog>
    <div
      class="w-160 max-w-full h-auto flex flex-col justify-start items-start bg-white rounded-md"
    >
      <header
        class="w-full flex flex-row justify-between items-center p-4 pr-5 bg-gray-100 rounded-t-lg"
      >
        <span class="text-2xl">Step-to-step guide</span>
        <i
          class="fas fa-times-circle text-xl text-gray-400 cursor-pointer hover:text-gray-500"
          @click="handleCloseBtnClick"
        ></i>
      </header>
      <main class="w-full flex flex-col justify-start items-start p-4 pr-5">
        <p class="leading-7">
          It's very easy to add star-history chart into GitHub README, just two
          steps:
        </p>
        <ol class="list-decimal pl-5 mt-3">
          <li class="mb-2">
            <p>Copy the raw markdown string below</p>
            <div
              class="relative w-full h-auto border mt-2 px-4 py-3 rounded-md shadow-inner"
            >
              <pre
                class="font-mono break-all text-gray-600 text-sm whitespace-pre-wrap"
                >{{ embedCode }}</pre
              >
              <button
                class="absolute top-2 right-2 px-4 leading-8 text-sm rounded-md bg-green-600 shadow-inner text-white hover:bg-green-700"
                @click="handleCopyBtnClick"
              >
                Copy
              </button>
            </div>
          </li>
          <li class="mb-2">
            <p>
              Paste it into your repo
              <a
                v-if="singleRepo"
                class="font-mono underline text-blue-600 hover:opacity-80"
                :href="`https://github.com/${singleRepo}/blob/master/README.md`"
                target="_blank"
                >README</a
              >
              <span v-else class="font-mono">README</span>
            </p>
          </li>
        </ol>
      </main>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import utils from "../../common/utils";
import toast from "../helpers/toast";
import useAppStore from "../store";
import Dialog from "./Dialog.vue";

const emit = defineEmits(["close"]);

const store = useAppStore();

const singleRepo = computed(() => {
  if (store.repos.length === 1) {
    return store.repos[0];
  } else {
    return null;
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

const handleCloseBtnClick = () => {
  emit("close");
};
</script>
