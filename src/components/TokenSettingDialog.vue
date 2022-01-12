<template>
  <Dialog>
    <div
      class="w-640px max-w-full h-auto flex flex-col justify-start items-start bg-white rounded-md"
    >
      <header
        class="w-full flex flex-row justify-between items-center p-4 pr-5 bg-gray-100 rounded-t-lg"
      >
        <span class="text-2xl"
          >{{ tokenCache ? "Edit" : "Add" }} GitHub Access Token</span
        >
        <i
          class="fas fa-times-circle text-xl text-gray-400 cursor-pointer hover:text-gray-500"
          @click="handleCloseBtnClick"
        ></i>
      </header>
      <main class="w-full flex flex-col justify-start items-start p-4 pr-5">
        <p>
          Star-history use GitHub API to retrieve repository metadata. You may
          see this page because you have hit the
          <a
            class="text-blue-500"
            href="https://docs.github.com/en/rest/overview/resources-in-the-rest-api"
            target="_blank"
          >
            GitHub API rate limit </a
          >.
        </p>
        <br />
        <p>
          Star-history will need your
          <a
            class="text-blue-500"
            href="https://github.com/settings/tokens"
            target="_blank"
          >
            personal access token </a
          >to unlimit it. If you don't already have one,
          <a
            class="text-blue-500"
            href="https://github.com/settings/tokens/new"
            target="_blank"
          >
            create one
          </a>
          , and paste it into the textbox below (no scope to your personal data
          is needed)
        </p>
        <br />
        <p class="font-bold">
          Access Token (will be stored in your local storage)
        </p>
        <input
          v-model="state.token"
          class="w-full outline-none border mt-2 shadow-inner p-2 rounded-md focus:shadow-focus"
          type="text"
        />
      </main>
      <footer
        class="w-full flex flex-row justify-end bg-gray-100 items-center p-4 pr-5 border-t rounded-b-md"
      >
        <button
          class="pl-4 pr-4 h-10 rounded-md bg-green-500 shadow-inner text-light hover:bg-green-600"
          @click="handleSaveTokenBtnClick"
        >
          Save
        </button>
      </footer>
    </div>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import storage from "../helpers/storage";
import useAppStore from "../store";
import Dialog from "./Dialog.vue";

interface State {
  token: string;
}

export default defineComponent({
  name: "TokenSettingDialog",
  components: { Dialog },
  emits: ["close"],
  setup(_, { emit }) {
    const store = useAppStore();
    const state = reactive<State>({
      token: store.token,
    });

    const handleSaveTokenBtnClick = () => {
      store.setToken(state.token);
      storage.set({
        accessTokenCache: state.token,
      });
      emit("close");
    };

    const handleCloseBtnClick = () => {
      emit("close");
    };

    return {
      state,
      tokenCache: store.token,
      handleSaveTokenBtnClick,
      handleCloseBtnClick,
    };
  },
});
</script>
