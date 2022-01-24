<template>
  <Dialog>
    <div
      class="w-640px max-w-full h-auto flex flex-col justify-start items-start bg-white rounded-md"
    >
      <header
        class="w-full flex flex-row justify-between items-center p-4 pr-5 bg-gray-100 rounded-t-lg"
      >
        <span class="text-2xl">Embed Chart</span>
        <i
          class="fas fa-times-circle text-xl text-gray-400 cursor-pointer hover:text-gray-500"
          @click="handleCloseBtnClick"
        ></i>
      </header>
      <main class="w-full flex flex-col justify-start items-start p-4 pr-5">
        <p>
          Star-history will need your
          <a
            class="text-blue-500"
            href="https://github.com/settings/tokens"
            target="_blank"
          >
            personal access token
          </a>
          to unlimit the
          <a
            class="text-blue-500"
            href="https://developer.github.com/v3/#rate-limiting"
            target="_blank"
          >
            GitHub API rate limit</a
          >. If you don't have one,
          <a
            class="text-blue-500"
            href="https://github.com/settings/tokens/new"
            target="_blank"
          >
            create one</a
          >, and paste it into the textbox below (no scope to your personal data
          is needed).
        </p>
        <p class="leading-8 mt-4">
          <span class="text-red-600">*</span> Access Token
        </p>
        <p class="rounded-md font-bold text-sm text-red-600">
          Please do not give ANY SCOPE PERMISSION to the token. If you did,
          someone could use this to access your personal data.
        </p>
        <input
          v-model="state.token"
          class="w-full outline-none border mt-2 shadow-inner p-2 rounded-md focus:shadow-focus"
          type="text"
        />
        <p class="leading-8 mt-4 mb-1">
          Copy and paste the below codes into your blog or website
        </p>
        <div
          class="relative w-full h-auto border px-4 py-3 pb-14 rounded-md shadow-inner"
        >
          <p class="font-mono break-all text-gray-600 text-sm">
            {{ state.embedCode }}
          </p>
          <button
            class="absolute bottom-2 right-2 px-4 leading-10 rounded-md bg-green-600 shadow-inner text-light hover:bg-green-700"
            @click="handleCopyBtnClick"
          >
            Copy
          </button>
        </div>
      </main>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from "vue";
import toast from "../helpers/toast";
import utils from "../helpers/utils";
import useAppStore from "../store";
import Dialog from "./Dialog.vue";

interface State {
  embedCode: string;
  token: string;
}

const emit = defineEmits(["close"]);

const store = useAppStore();
const state = reactive<State>({
  embedCode: "",
  token: store.token,
});

onMounted(() => {
  state.embedCode = `<iframe style="width:100%;height:auto;min-width:600px;min-height:400px;" src="${
    window.location.origin
  }/embed?secret=${btoa(state.token)}#${store.repos.join(
    "&"
  )}&Date" frameBorder="0"></iframe>`;
});

watch(
  () => [state.token],
  () => {
    state.embedCode = `<iframe style="width:100%;height:auto;min-width:600px;min-height:400px;" src="${
      window.location.origin
    }/embed?secret=${btoa(state.token)}#${store.repos.join(
      "&"
    )}&Date" frameBorder="0"></iframe>`;
  }
);

const handleCopyBtnClick = () => {
  if (state.token === "") {
    toast.warn("Please input the token");
    return;
  }

  utils.copyTextToClipboard(state.embedCode);
  toast.succeed("Embed code copied");
};

const handleCloseBtnClick = () => {
  emit("close");
};
</script>
