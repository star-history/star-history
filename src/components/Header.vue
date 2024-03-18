<template>
  <TopBanner />
  <header
    class="w-full h-14 shrink-0 flex flex-row justify-center items-center bg-dark text-light"
  >
    <div
      class="w-full md:max-w-5xl lg:max-w-7xl h-full flex flex-row justify-between items-center px-0 sm:px-4"
    >
      <div class="h-full flex flex-row justify-start items-center">
        <router-link
          class="h-full flex flex-row justify-center items-center px-2 hover:bg-zinc-800"
          to="/"
        >
          <img class="w-7 h-auto" src="/icon.png" />
        </router-link>
        <a
          class="h-full flex flex-row justify-center items-center px-2 hover:bg-zinc-800"
          href="https://forum.star-history.com"
          target="_blank"
        >
          <span class="text-light font-semibold">Forum</span>
        </a>
        <router-link
          class="h-full flex flex-row justify-center items-center px-2 hover:bg-zinc-800"
          to="/blog"
        >
          <span class="text-light font-semibold">Blog</span>
        </router-link>
        <span
          class="h-full flex flex-row justify-center items-center cursor-pointer font-semibold mr-2 px-2 hover:bg-zinc-800"
          @click="handleSetTokenBtnClick"
        >
          {{ token ? "Edit" : "Add" }} Access Token
        </span>
      </div>
      <div class="hidden h-full md:flex flex-row justify-start items-center">
        <a
          href="https://www.bytebase.com?source=star-history"
          target="_blank"
          class="h-full flex flex-row justify-center items-center px-4 hover:bg-zinc-800"
        >
          <img class="h-6 mt-1 mr-2" src="/craft-by-bytebase.webp" />
        </a>
      </div>
      <div
        class="h-full hidden md:flex flex-row justify-end items-center space-x-1"
      >
        <a
          class="h-full flex flex-row justify-center items-center px-2 hover:bg-zinc-800"
          href="https://twitter.com/StarHistoryHQ"
          target="_blank"
        >
          <i class="fab fa-twitter text-2xl text-blue-300"></i>
        </a>
        <!-- <a
          class="h-full flex flex-row justify-center items-center px-2 mr-2 hover:bg-zinc-800"
          href="https://discord.gg/yyzsmgcqg7"
          target="_blank"
        >
          <i class="fab fa-discord text-2xl text-indigo-300"></i>
        </a> -->
        <GitHubStarButton />
      </div>
      <div class="h-full flex md:hidden flex-row justify-end items-center">
        <span
          class="relative h-full w-10 px-3 flex flex-row justify-center items-center cursor-pointer font-semibold text-light hover:bg-zinc-800"
          @click="handleToggleDropMenuBtnClick"
        >
          <span
            class="w-4 transition-all h-px bg-light absolute top-1/2"
            :class="state.showDropMenu ? 'w-6 rotate-45' : '-mt-1'"
          ></span>
          <span
            class="w-4 transition-all h-px bg-light absolute top-1/2"
            :class="state.showDropMenu ? 'hidden' : ''"
          ></span>
          <span
            class="w-4 transition-all h-px bg-light absolute top-1/2"
            :class="state.showDropMenu ? 'w-6 -rotate-45' : 'mt-1'"
          ></span>
        </span>
      </div>
    </div>
  </header>
  <div
    class="`w-full h-auto py-2 flex md:hidden flex-col justify-start items-start shadow-lg border-b"
    :class="state.showDropMenu ? 'flex' : 'hidden'"
  >
    <router-link
      class="h-12 px-3 w-full flex flex-row justify-start items-center cursor-pointer font-semibold text-dark mr-2 hover:bg-gray-100 hover:text-blue-500"
      to="/blog/how-to-use-github-star-history"
    >
      📕 How to use this site
    </router-link>
    <span
      class="h-12 px-3 w-full flex flex-row justify-start items-center cursor-pointer font-semibold text-dark mr-2 hover:bg-gray-100 hover:text-blue-500"
      @click="handleSetTokenBtnClick"
    >
      {{ token ? "Edit" : "Add" }} Access Token
    </span>
    <span class="h-12 px-3 w-full flex flex-row justify-start items-center">
      <a
        class="github-button -mt-1"
        href="https://github.com/star-history/star-history"
        data-show-count="true"
        aria-label="Star star-history/star-history on GitHub"
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

<script lang="ts" setup>
import { computed, reactive } from "vue";
import useAppStore from "../store";
import TopBanner from "./TopBanner.vue";
import GitHubStarButton from "./GitHubStarButton.vue";
import TokenSettingDialog from "./TokenSettingDialog.vue";

interface State {
  showDropMenu: boolean;
  showSetTokenDialog: boolean;
}

const store = useAppStore();
const state = reactive<State>({
  showDropMenu: false,
  showSetTokenDialog: false,
});

const token = computed(() => {
  return store.token;
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
</script>
