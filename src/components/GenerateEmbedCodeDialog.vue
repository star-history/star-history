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
        <div class="w-full py-4 flex flex-row justify-start items-center">
          <span class="w-16 text-right pr-2">Token: </span>
          <input
            v-model="state.token"
            class="border w-96 px-3 leading-8 rounded"
            type="text"
          />
        </div>
        <p>
          <span class="font-bold text-red-600"
            >PLEASE DO NOT GIVE ANY SCOPE PERMISSION TO THE TOKEN.</span
          >
          If you did, someone could use this to access your personal data.
        </p>
        <div class="w-full py-3 flex flex-row justify-start items-center">
          <span class="w-16 text-right pr-2">Width: </span>
          <input
            v-model="state.width"
            min="600"
            class="border w-24 px-3 mr-1 leading-8 rounded"
            type="number"
          />
          <span>px</span>
        </div>
        <div class="w-full py-3 flex flex-row justify-start items-center">
          <span class="w-16 text-right pr-2">Height: </span>
          <input
            v-model="state.height"
            min="400"
            class="border w-24 px-3 mr-1 leading-8 rounded"
            type="number"
          />
          <span>px</span>
        </div>
        <p class="w-16 text-right pr-2 leading-8">Codes:</p>
        <div class="relative w-full h-auto border p-4 pb-6 rounded">
          <p class="font-mono break-all text-gray-600">{{ state.embedCode }}</p>
          <button
            class="absolute bottom-2 right-2 pl-4 pr-4 h-10 rounded-md bg-green-500 shadow-inner text-light hover:bg-green-600"
            @click="handleCopyBtnClick"
          >
            Copy
          </button>
        </div>
        <p class="my-2 text-dark">
          Usage: Copy and paste the code into your blog or website.
        </p>
      </main>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from "vue";
import { useStore } from "vuex";
import toast from "../helpers/toast";
import utils from "../helpers/utils";
import Dialog from "./Dialog.vue";

interface State {
  embedCode: string;
  token: string;
  width: number;
  height: number;
}

export default defineComponent({
  name: "GenerateEmbedCodeDialog",
  components: { Dialog },
  emits: ["close"],
  setup(_, { emit }) {
    const store = useStore<AppState>();
    const state = reactive<State>({
      embedCode: "",
      token: store.state.token,
      width: 600,
      height: 400,
    });

    onMounted(() => {
      state.embedCode = `<iframe width="${state.width}" height="${
        state.height
      }" src="${window.location.origin}/embed/?secret=${btoa(
        state.token
      )}#${store.state.repos.join("&")}&Date" frameBorder="0"></iframe>`;
    });

    watch(
      () => [state.token, state.width, state.height],
      () => {
        if (!state.width || state.width < 600) {
          state.width = 600;
        }
        if (!state.height || state.height < 400) {
          state.height = 400;
        }

        state.embedCode = `<iframe width="${state.width}" height="${
          state.height
        }" src="${window.location.origin}/embed/?secret=${btoa(
          state.token
        )}#${store.state.repos.join("&")}&Date" frameBorder="0"></iframe>`;
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

    return {
      state,
      handleCloseBtnClick,
      handleCopyBtnClick,
    };
  },
});
</script>
