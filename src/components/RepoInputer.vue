<template>
  <div class="w-full shrink-0 flex flex-col justify-start items-center">
    <div class="w-full flex flex-row justify-center items-center">
      <div class="w-full flex flex-row justify-center items-center">
        <div
          class="w-auto grow max-w-2xl mt-12 flex flex-row justify-center items-center border border-zinc-700 rounded border-solid"
        >
          <input
            v-model="state.repo"
            class="w-auto grow p-1.5 pl-3 focus:outline-none"
            type="text"
            placeholder="bytebase/star-history or https://github.com/bytebase/star-history"
          />
          <button
            class="w-32 p-1.5 border-l outline-0 border-zinc-700 bg-zinc-700 text-white border-solid"
            @click="handleAddRepoBtnClick"
          >
            Show Me
          </button>
        </div>
      </div>
    </div>
    <!-- repo list -->
    <div v-if="false" class="w-full flex flex-row justify-center items-center">
      <div
        class="w-auto grow max-w-2xl mt-4 flex flex-row justify-center items-center"
      >
        <div
          v-for="item of repos"
          :key="item"
          class="w-auto flex flex-row justify-center items-center border rounded-md border-solid p-1 pl-2 pr-2 mr-3 last:mr-0"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useStore } from "vuex";
import { AppState } from "../store";

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

    const handleAddRepoBtnClick = () => {
      let repo = state.repo;
      if (state.repo === "") {
        repo = "bytebase/star-history";
      }
      store.commit("addRepo", repo);
    };

    return {
      state,
      repos: store.state.repos,
      handleAddRepoBtnClick,
    };
  },
});
</script>
