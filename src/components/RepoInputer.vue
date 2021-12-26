<template>
  <div class="w-full shrink-0 flex flex-col justify-start items-center">
    <div
      class="w-full px-4 max-w-2xl mt-12 flex flex-row justify-center items-center"
    >
      <input
        ref="inputElRef"
        v-model="state.repo"
        class="w-auto h-9 shrink grow px-2 text-dark shadow-inner outline-none border border-dark rounded-l border-solid placeholder:text-gray-300 focus:shadow-focus"
        type="text"
        placeholder="bytebase/star-history or https://github.com/bytebase/star-history"
        @paste="handleInputerPasted"
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
    <div class="w-full mt-4 flex flex-row justify-center items-center">
      <div
        class="w-full max-w-2xl flex flex-row flex-wrap justify-center items-center"
      >
        <div
          v-for="item of state.repos"
          :key="item"
          class="leading-8 px-3 pl-4 mb-2 text-dark rounded-2xl flex flex-row justify-center items-center border border-dark shadow-inner mr-3 last:mr-0"
        >
          <a
            class="mr-2 hover:underline cursor-pointer"
            :href="`https://github.com/${item}`"
            target="_blank"
          >
            {{ item }}
          </a>
          <i
            class="fas fa-times-circle cursor-pointer text-sm hover:text-black"
            @click="handleRepoItemClick(item)"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { GITHUB_REPO_URL_REG } from "../helpers/consts";

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
    const inputElRef = ref<HTMLInputElement | null>(null);

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
        if (GITHUB_REPO_URL_REG.test(repo)) {
          const regResult = GITHUB_REPO_URL_REG.exec(repo);
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

    const handleInputerPasted = async (event: ClipboardEvent) => {
      if (event.clipboardData) {
        event.preventDefault();
        console.log(event, event.clipboardData.getData("text"));
        const text = event.clipboardData
          .getData("text")
          .replace(/(\r\n|\n|\r)/gm, "");
      }
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
      inputElRef,
      handleAddRepoBtnClick,
      handleRepoItemClick,
      handleInputerPasted,
    };
  },
});
</script>

<style scoped>
input::placeholder {
  color: #c2c2c2;
}
</style>
