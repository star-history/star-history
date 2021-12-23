<template>
  <dialog
    class="fixed w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-60 z-50 top-0 left-0"
  >
    <div
      class="w-160 max-w-full h-auto flex flex-col justify-start items-start bg-white rounded-lg"
    >
      <header
        class="w-full flex flex-row justify-between items-center p-4 bg-gray-200 rounded-t-lg"
      >
        <span class="text-xl">Setting GitHub Access Token</span>
        <i
          class="far fa-times-circle text-2xl text-gray-700 cursor-pointer hover:opacity-80"
          @click="handleCloseBtnClick"
        ></i>
      </header>
      <main class="w-full flex flex-col justify-start items-start p-4">
        <p>
          Star-history use GitHub API to retrieve repository metadata. You may
          see this page because you have hit the
          <a
            class="text-cyan-500"
            href="https://developer.github.com/v3/#rate-limiting"
          >
            GitHub API rate limit </a
          >.
        </p>
        <br />
        <p>
          Star-history will need your
          <a class="text-cyan-500" href="https://github.com/settings/tokens"
            >personal access token</a
          >
          to unlimit it. If you don't already have one,
          <a
            class="text-cyan-500"
            href="https://github.com/settings/tokens/new"
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
          class="w-full border mt-2 border-gray-500 p-2 rounded-md"
          type="text"
        />
      </main>
      <footer
        class="w-full flex flex-row justify-end items-center p-4 border-t"
      >
        <button
          class="pl-4 pr-4 h-10 rounded-md bg-green-600 text-white hover:opacity-80"
          @click="handleSaveTokenBtnClick"
        >
          Save
        </button>
      </footer>
    </div>
  </dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useStore } from "vuex";

interface State {
  token: string;
}

export default defineComponent({
  name: "TokenSettingDialog",
  props: {
    destory: {
      type: Function,
    },
  },
  setup(props) {
    const store = useStore<AppState>();
    const state = reactive<State>({
      token: store.state.token,
    });

    const handleSaveTokenBtnClick = () => {
      store.commit("setToken", state.token);
    };

    const handleCloseBtnClick = () => {
      if (props.destory) {
        props.destory();
      }
    };

    return {
      state,
      handleSaveTokenBtnClick,
      handleCloseBtnClick,
    };
  },
});
</script>
