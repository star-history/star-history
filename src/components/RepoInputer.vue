<template>
  <div class="w-full shrink-0 flex flex-col justify-start items-center">
    <div class="w-full flex flex-row justify-center items-center">
      <div class="w-full flex flex-row justify-center items-center">
        <div
          class="w-auto grow max-w-2xl mt-12 flex flex-row justify-center items-center drop-shadow-lg"
        >
          <input
            v-model="state.repo"
            class="w-auto grow p-2 pl-4 outline-none border border-zinc-400 rounded-l-lg border-solid"
            type="text"
            placeholder="bytebase/star-history or https://github.com/bytebase/star-history"
          />
          <button
            class="w-32 p-2 border border-zinc-800 rounded-r-lg border-solid bg-zinc-800 text-white hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="state.isFetching"
            @click="handleAddRepoBtnClick"
          >
            Show Me
          </button>
        </div>
      </div>
    </div>
    <!-- repo list -->
    <div class="w-full h-14 flex flex-row justify-center items-center">
      <div
        class="w-auto grow max-w-2xl mt-4 flex flex-row justify-center items-center"
      >
        <div
          v-for="item of state.repos"
          :key="item"
          class="w-auto flex flex-row justify-center items-center border rounded-md border-solid p-1 pl-2 pr-2 mr-3 cursor-pointer last:mr-0 hover:line-through"
          @click="handleRepoItemClick(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
import { useStore } from "vuex";

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

    const handleAddRepoBtnClick = () => {
      if (state.isFetching) {
        return;
      }

      let repo = state.repo;
      if (state.repo === "") {
        repo = "bytebase/star-history";
      }
      store.commit("addRepo", repo);
      state.repo = "";
    };

    const handleRepoItemClick = (repo: string) => {
      store.commit("delRepo", repo);
    };

    watch(store.state, () => {
      state.isFetching = store.state.isFetching;
      state.repos = store.state.repos;
    });

    return {
      state,
      handleAddRepoBtnClick,
      handleRepoItemClick,
    };
  },
});
</script>
