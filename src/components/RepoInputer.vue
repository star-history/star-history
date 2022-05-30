<template>
  <div class="w-full px-3 shrink-0 flex flex-col justify-start items-center">
    <div
      class="mt-4 flex flex-row justify-center items-center flex-wrap"
      :style="`visibility: ${store.repos.length > 0 ? 'visible' : 'hidden'}`"
    >
      <div class="text-gray-700 text-sm">
        <span class="text-lg">👉</span> Add this <b>LIVE chart</b> to your
        GitHub README
      </div>
      <span
        class="ml-3 px-2 py-1 text-sm cursor-pointer rounded bg-green-600 text-white shadow hover:bg-green-700"
        @click="state.showEmbedChartGuideDialog = true"
        >Show me How</span
      >
    </div>
    <div
      class="w-auto sm:w-full grow max-w-3xl 2xl:max-w-4xl mt-4 flex flex-row justify-center items-center shadow-inner border border-solid border-dark rounded"
    >
      <input
        ref="inputElRef"
        v-model="state.repo"
        class="w-auto h-9 px-2 grow shrink text-dark outline-none rounded rounded-r-none placeholder:text-gray-300 focus:shadow-focus"
        type="text"
        :placeholder="
          state.repos.length > 0
            ? '...add next repository'
            : 'bytebase/star-history or https://github.com/bytebase/star-history'
        "
        @paste="handleInputerPasted"
        @keydown="handleInputerKeyDown"
      />
      <button
        class="h-9 pl-4 pr-4 whitespace-nowrap w-auto text-dark border-l border-dark hover:bg-dark hover:text-light"
        :class="isFetching ? 'cursor-wait' : ''"
        @click="handleAddRepoBtnClick"
      >
        View star history
      </button>
    </div>
    <!-- repo list -->
    <div class="w-full mt-4 flex flex-row justify-center items-center">
      <div
        v-if="state.repos.length > 0"
        class="w-full max-w-2xl flex flex-row flex-wrap justify-center items-center"
      >
        <div
          v-for="item of state.repos"
          :key="item.name"
          class="leading-8 px-3 pr-2 mb-2 text-dark rounded flex flex-row justify-center items-center border mr-3 last:mr-0"
        >
          <span
            class="mr-1 cursor-pointer hover:line-through select-none"
            :class="item.visible ? '' : 'line-through text-gray-400'"
            @click="handleToggleRepoItemVisible(item.name)"
          >
            {{ item.name }}
          </span>
          <span
            class="relative w-5 h-5 flex flex-row justify-center items-center cursor-pointer hover:opacity-60"
            @click="handleDeleteRepoBtnClick(item.name)"
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
    <!-- embed chart guide dialog -->
    <EmbedChartGuideDialog
      v-if="state.showEmbedChartGuideDialog"
      @close="state.showEmbedChartGuideDialog = false"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { first } from "lodash-es";
import { GITHUB_REPO_URL_REG } from "../helpers/consts";
import toast from "../helpers/toast";
import useAppStore from "../store";
import EmbedChartGuideDialog from "./EmbedChartGuideDialog.vue";

interface State {
  repo: string;
  repos: {
    name: string;
    visible: boolean;
  }[];
  showEmbedChartGuideDialog: boolean;
}

const store = useAppStore();
const state = reactive<State>({
  repo: "",
  repos: [],
  showEmbedChartGuideDialog: false,
});

const inputElRef = ref<HTMLInputElement | null>(null);

const isFetching = computed(() => {
  return store.isFetching;
});

onMounted(() => {
  state.repos = store.repos.map((r) => {
    return {
      name: r,
      visible: true,
    };
  });
});

watch(
  () => [store.repos, store.chartMode],
  () => {
    for (const r of state.repos) {
      if (r.visible && !store.repos.includes(r.name)) {
        state.repos.splice(state.repos.indexOf(r), 1);
      }
    }

    let hash = "";
    if (store.repos.length > 0) {
      hash = `#${store.repos.join("&")}&${store.chartMode}`;
    }
    // Sync location hash only right here
    window.location.hash = hash;
  }
);

const handleAddRepoBtnClick = () => {
  if (store.isFetching) {
    return;
  }

  let rawRepos = state.repo;
  if (rawRepos === "" && store.repos.length === 0) {
    rawRepos = "bytebase/star-history";
  }

  if (rawRepos === "") {
    toast.warn("Please input the repo name");
    return;
  }

  for (const rawRepo of rawRepos.split(",")) {
    let repo = first(rawRepo.split("#"));
    if (!repo) {
      continue;
    }

    if (GITHUB_REPO_URL_REG.test(repo)) {
      const regResult = GITHUB_REPO_URL_REG.exec(repo);
      if (regResult && regResult[1]) {
        repo = regResult[1];
      }
    }
    if (!repo.includes("/")) {
      repo += `/${repo}`;
    }
    for (const r of state.repos) {
      if (r.name === repo) {
        if (r.visible) {
          toast.warn(`Repo ${repo} is already on the chart`);
        } else {
          r.visible = true;
          store.setRepos(
            state.repos.filter((r) => r.visible).map((r) => r.name)
          );
        }
        state.repo = "";
        return;
      }
    }
    state.repos.push({
      name: repo,
      visible: true,
    });
    store.addRepo(repo);
  }
  state.repo = "";
};

const handleToggleRepoItemVisible = (repo: string) => {
  for (const r of state.repos) {
    if (r.name === repo) {
      r.visible = !r.visible;
      break;
    }
  }
  store.setRepos(state.repos.filter((r) => r.visible).map((r) => r.name));
};

const handleDeleteRepoBtnClick = (repo: string) => {
  for (const r of state.repos) {
    if (r.name === repo) {
      state.repos.splice(state.repos.indexOf(r), 1);
      break;
    }
  }
  store.delRepo(repo);
};

const handleClearAllRepoBtnClick = () => {
  state.repos = [];
  store.setRepos([]);
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
      .replace(/(?:\r\n|\r|\n| )/g, "");
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

const handleInputerKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleAddRepoBtnClick();
  }
};
</script>

<style scoped>
input::placeholder {
  color: #c2c2c2;
}
</style>
