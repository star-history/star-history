<template>
  <div class="w-full shrink-0 flex flex-col justify-start items-center">
    <div
      class="w-full px-3 max-w-2xl mt-12 flex flex-row justify-center items-center"
    >
      <input
        v-model="state.repo"
        class="w-auto h-9 shrink grow px-2 text-dark shadow-inner outline-none border border-dark rounded-l border-solid placeholder:text-gray-300 focus:shadow-focus"
        type="text"
        placeholder="bytebase/star-history or https://github.com/bytebase/star-history"
      />
      <button
        :class="
          'h-9 pl-4 pr-4 whitespace-nowrap w-auto border border-dark border-l-0 rounded-r border-solid text-dark hover:bg-dark hover:text-light ' +
          (state.isFetching ? 'cursor-wait !opacity-60' : '')
        "
        @click="handleAddRepoBtnClick"
      >
        View star history
      </button>
    </div>
    <!-- repo list -->
    <div class="w-full h-14 mt-4 flex flex-row justify-center items-center">
      <div
        class="w-full px-3 max-w-2xl flex flex-row justify-center items-center"
      >
        <div
          v-for="item of state.repos"
          :key="item"
          class="w-auto flex flex-row justify-center items-center border rounded border-solid border-zinc-400 p-1 pl-2 pr-2 mr-3 cursor-pointer last:mr-0 hover:line-through hover:opacity-60"
          @click="handleRepoItemClick(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watch } from "vue";
import { useStore } from "vuex";
import { githubRepoUrlReg } from "../helpers/consts";

interface State {
  repo: string;
  repos: string[];
  isFetching: boolean;
}

export default defineComponent({
  name: "RepoInputer",
  setup() {
    const store = useStore<AppState>();
    const state = reactive<State>({
      repo: "",
      repos: [],
      isFetching: false,
    });

    onMounted(() => {
      let hash = "";
      if (store.state.repos.length > 0) {
        hash = `#repos=${store.state.repos.join(",")}`;
      }
      window.location.hash = hash;
    });

    const handleAddRepoBtnClick = () => {
      if (state.isFetching) {
        return;
      }

      const repos = state.repo || "bytebase/star-history";
      for (const repo of repos.split(" ")) {
        if (githubRepoUrlReg.test(repo)) {
          const regResult = githubRepoUrlReg.exec(repo);
          if (regResult) {
            const str = regResult[1];
            if (str) {
              store.commit("addRepo", str);
              continue;
            }
          }
        }
        store.commit("addRepo", repo);
      }
      state.repo = "";
    };

    const handleRepoItemClick = (repo: string) => {
      store.commit("delRepo", repo);
    };

    watch(store.state, () => {
      state.isFetching = store.state.isFetching;
      state.repos = store.state.repos;

      // handle location change right here
      let hash = "";
      if (store.state.repos.length > 0) {
        hash = `#repos=${store.state.repos.join(",")}`;
      }
      window.location.hash = hash;
    });

    return {
      state,
      handleAddRepoBtnClick,
      handleRepoItemClick,
    };
  },
});
</script>
