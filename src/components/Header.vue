<template>
  <header
    class="w-full h-52px shrink-0 flex flex-row justify-center items-center bg-dark text-light"
  >
    <div
      class="w-full md:w-5/6 md:pr-0 lg:max-w-7xl h-full flex flex-row justify-between items-center"
    >
      <div class="h-full flex flex-row justify-start items-center">
        <a
          class="h-full flex flex-row justify-center items-center px-4 hover:bg-zinc-800"
          href="/"
        >
          <img class="w-7 h-auto" src="/icon.png" />
          <span class="font-bold text-light pl-3">Star history</span>
        </a>
        <a
          class="h-full flex flex-row justify-center items-center px-4 hover:bg-zinc-800"
          href="https://twitter.com/StarHistoryHQ"
          target="_blank"
        >
          <i class="fab fa-twitter text-2xl"></i>
        </a>
      </div>
      <div class="h-full hidden md:flex flex-row justify-end items-center">
        <span
          class="h-full flex flex-row justify-center items-center cursor-pointer font-bold mr-2 px-3 hover:bg-zinc-800"
          @click="handleSetTokenBtnClick"
        >
          {{ token ? "Edit" : "Add" }} Access Token
        </span>
        <span class="h-6 flex flex-row justify-center items-center mt-1">
          <a
            class="github-button -mt-1"
            href="https://github.com/bytebase/star-history"
            target="_blank"
            data-show-count="true"
            aria-label="Star bytebase/star-history on GitHub"
          >
            Star
          </a>
        </span>
      </div>
      <div class="h-full flex md:hidden flex-row justify-end items-center">
        <span
          class="relative h-full w-10 px-3 flex flex-row justify-center items-center cursor-pointer font-bold text-light hover:bg-zinc-800"
          @click="handleToggleDropMenuBtnClick"
        >
          <span
            :class="`w-4 transition-all border-t-2 absolute top-1/2 ${
              state.showDropMenu ? 'w-6 rotate-45' : '-mt-1'
            }`"
          ></span>
          <span
            :class="`w-4 transition-all border-t-2 absolute top-1/2 ${
              state.showDropMenu ? 'hidden' : ''
            }`"
          ></span>
          <span
            :class="`w-4 transition-all border-t-2 absolute top-1/2 ${
              state.showDropMenu ? 'w-6 -rotate-45' : 'mt-1'
            }`"
          ></span>
        </span>
      </div>
    </div>
  </header>
  <div
    :class="`w-full h-auto py-2 flex md:hidden flex-col justify-start items-start shadow-lg border-b ${
      state.showDropMenu ? 'flex' : 'hidden'
    }`"
  >
    <span
      class="h-12 px-3 w-full flex flex-row justify-start items-center cursor-pointer font-bold text-dark mr-2 hover:bg-gray-100 hover:text-blue-500"
      @click="handleSetTokenBtnClick"
    >
      {{ token ? "Edit" : "Add" }} Access Token
    </span>
    <span class="h-12 px-3 w-full flex flex-row justify-start items-center">
      <a
        class="github-button -mt-1"
        href="https://github.com/bytebase/star-history"
        data-show-count="true"
        aria-label="Star bytebase/star-history on GitHub"
        target="_blank"
      >
        Star
      </a>
    </span>
  </div>
  <TokenSettingDialog
    v-if="state.showSetTokenDialog"
    @close="handleSetTokenDialogClose"
  />
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { mapState } from "vuex";
import TokenSettingDialog from "./TokenSettingDialog.vue";

interface State {
  showDropMenu: boolean;
  showSetTokenDialog: boolean;
}

export default defineComponent({
  name: "Header",
  components: { TokenSettingDialog },
  setup() {
    const state = reactive<State>({
      showDropMenu: false,
      showSetTokenDialog: false,
    });

    const handleSetTokenBtnClick = () => {
      state.showSetTokenDialog = true;
    };

    const handleSetTokenDialogClose = () => {
      state.showSetTokenDialog = false;
    };

    const handleToggleDropMenuBtnClick = () => {
      state.showDropMenu = !state.showDropMenu;
    };

    return {
      state,
      handleSetTokenBtnClick,
      handleToggleDropMenuBtnClick,
      handleSetTokenDialogClose,
    };
  },
  computed: mapState({
    token(state: AppState) {
      return state.token;
    },
  }),
});
</script>
