<template>
  <div class="w-full shrink-0 flex flex-col justify-start items-center">
    <div
      class="w-full max-w-3xl 2xl:max-w-4xl px-4 mt-12 flex flex-row justify-center items-center"
    >
      <input
        ref="inputElRef"
        v-model="state.repo"
        class="w-auto h-9 shrink grow px-2 text-dark shadow-inner outline-none border border-dark rounded-l border-solid placeholder:text-gray-300 focus:shadow-focus"
        type="text"
        :placeholder="
          repos.length > 0
            ? '...add next repository'
            : 'bytebase/star-history or https://github.com/bytebase/star-history'
        "
        @paste="handleInputerPasted"
        @keydown="handleInputerKeyDown"
      />
      <button
        :class="
          'h-9 pl-4 pr-4 whitespace-nowrap w-auto border border-dark border-l-0 rounded-r border-solid text-dark hover:bg-dark hover:text-light ' +
          (isFetching ? 'cursor-wait !opacity-60' : '')
        "
        @click="handleAddRepoBtnClick"
      >
        View star history
      </button>
    </div>
    <!-- repo list -->
    <div class="w-full mt-4 flex flex-row justify-center items-center">
      <div
        v-if="repos.length > 0"
        class="w-full max-w-2xl flex flex-row flex-wrap justify-center items-center"
      >
        <div
          v-for="item of repos"
          :key="item"
          class="leading-8 px-3 pr-2 mb-2 text-dark rounded flex flex-row justify-center items-center border mr-3 last:mr-0"
        >
          <a
            class="mr-1 hover:underline cursor-pointer"
            :href="`https://github.com/${item}`"
            target="_blank"
          >
            {{ item }}
          </a>
          <span
            class="relative w-5 h-5 flex flex-row justify-center items-center cursor-pointer hover:opacity-60"
            @click="handleRepoItemClick(item)"
          >
            <span class="w-3 rotate-45 h-px bg-black absolute top-1/2"></span>
            <span class="w-3 -rotate-45 h-px bg-black absolute top-1/2"></span>
          </span>
        </div>
        <button
          class="leading-8 mb-2 text-black hover:bg-gray-100 px-3 rounded border border-transparent"
          @click="handleClearAllRepoBtnClick"
        >
          Clear all
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { GITHUB_REPO_URL_REG } from "../helpers/consts";
import toast from "../helpers/toast";

interface State {
  repo: string;
}

export default defineComponent({
  name: "RepoInputer",
  setup() {
    const store = useStore<AppState>();
    const state = reactive<State>({
      repo: "",
    });
    const inputElRef = ref<HTMLInputElement | null>(null);

    const handleAddRepoBtnClick = () => {
      if (store.state.isFetching) {
        return;
      }

      let rawRepos = state.repo;
      if (rawRepos === "" && store.state.repos.length === 0) {
        rawRepos = "bytebase/star-history";
      }

      if (rawRepos === "") {
        toast.warn("Please input the repo name");
        return;
      }

      for (const rawRepo of rawRepos.split(" ")) {
        let repo = rawRepo;
        if (GITHUB_REPO_URL_REG.test(repo)) {
          const regResult = GITHUB_REPO_URL_REG.exec(repo);
          if (regResult && regResult[1]) {
            repo = regResult[1];
          }
        }
        if (store.state.repos.includes(repo)) {
          toast.warn(`Repo ${repo} is already on the chart`);
          continue;
        }
        store.commit("addRepo", repo);
      }
      state.repo = "";
    };

    const handleRepoItemClick = (repo: string) => {
      store.commit("delRepo", repo);
    };

    const handleInputerKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleAddRepoBtnClick();
      }
    };

    const handleInputerPasted = async (event: ClipboardEvent) => {
      if (!inputElRef.value) {
        return;
      }
      const inputEl = inputElRef.value;
      if (event.clipboardData) {
        event.preventDefault();
        const text = event.clipboardData
          .getData("text")
          .replace(/(\r\n|\n|\r)/gm, "");
        const value = state.repo;
        const prevStr = value.slice(
          0,
          Math.min(inputEl.selectionStart || 0, inputEl.selectionEnd || 0)
        );
        const nextStr = value.slice(
          Math.max(inputEl.selectionStart || 0, inputEl.selectionEnd || 0)
        );
        state.repo = `${prevStr}${text}${nextStr}`;
      }
    };

    const handleClearAllRepoBtnClick = () => {
      store.commit("clearAll");
    };

    watch(
      () => store.state.repos,
      () => {
        let hash = "";
        if (store.state.repos.length > 0) {
          hash = `#${store.state.repos.join("&")}`;
        }
        window.location.hash = hash;
      }
    );

    return {
      state,
      inputElRef,
      isFetching: computed(() => {
        return store.state.isFetching;
      }),
      repos: computed(() => {
        return store.state.repos;
      }),
      handleAddRepoBtnClick,
      handleRepoItemClick,
      handleInputerPasted,
      handleClearAllRepoBtnClick,
      handleInputerKeyDown,
    };
  },
});
</script>

<style scoped>
input::placeholder {
  color: #c2c2c2;
}
</style>
