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
        <br />
        <p class="leading-8">
          <span class="text-red-600">*</span> Access Token
        </p>
        <input
          v-model="state.token"
          class="w-full outline-none border mt-2 shadow-inner p-2 rounded-md focus:shadow-focus"
          type="text"
        />
        <br />
        <p class="font-bold leading-8">Codes</p>
        <div
          class="relative w-full h-auto border mt-2 p-4 rounded-md shadow-inner"
        >
          <p class="font-mono break-all text-gray-600">{{ state.embedCode }}</p>
        </div>
        <p class="mt-2 leading-8 text-dark">
          Usage: Copy and paste the code into your blog or website.
        </p>
      </main>
      <footer
        class="w-full flex flex-row justify-end bg-gray-100 items-center p-4 pr-5 border-t rounded-b-md"
      >
        <button
          class="px-4 leading-10 rounded-md text-dark mr-2 hover:bg-gray-300"
          @click="handleCloseBtnClick"
        >
          Close
        </button>
        <button
          class="px-4 leading-10 rounded-md bg-green-600 shadow-inner text-light hover:bg-green-700"
          @click="handleCopyBtnClick"
        >
          Copy
        </button>
      </footer>
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
    });

    onMounted(() => {
      state.embedCode = `<iframe style="width:100%;height:auto;min-width:600px;min-height:400px;" src="${
        window.location.origin
      }/embed/?secret=${btoa(state.token)}#${store.state.repos.join(
        "&"
      )}&Date" frameBorder="0"></iframe>`;
    });

    watch(
      () => [state.token],
      () => {
        state.embedCode = `<iframe style="width:100%;height:auto;min-width:600px;min-height:400px;" src="${
          window.location.origin
        }/embed/?secret=${btoa(state.token)}#${store.state.repos.join(
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

    return {
      state,
      handleCloseBtnClick,
      handleCopyBtnClick,
    };
  },
});
</script>
