<template>
  <div
    ref="containerElRef"
    class="relative w-full flex grow flex-col justify-center items-center"
  >
    <div
      v-if="state.isFetching"
      class="absolute flex justify-center items-center z-10 top-0"
      :style="{
        width: `${Math.floor(state.height / 2) * 3}px`,
        height: `${Math.floor(state.height / 2) * 2}px`,
      }"
    >
      <div class="absolute w-full h-full blur-md bg-white bg-opacity-80"></div>
      <i class="fas fa-spinner animate-spin text-4xl z-10"></i>
    </div>
    <StarChart
      v-if="state.chartData.length > 0"
      :width="Math.floor(state.height / 2) * 3"
      :height="Math.floor(state.height / 2) * 2"
      :data="state.chartData"
    ></StarChart>
    <BytebaseBanner v-if="state.chartData.length > 0"></BytebaseBanner>
    <TokenSettingDialog
      v-if="state.showTokenDialog"
      :destory="hideTokenDialog"
    ></TokenSettingDialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import api from "../helpers/api";
import toast from "../helpers/toast";
import BytebaseBanner from "./BytebaseBanner.vue";
import StarChart from "./StarChart.vue";
import TokenSettingDialog from "./TokenSettingDialog.vue";

interface State {
  repoStarDataMap: Map<
    string,
    {
      date: string;
      count: number;
    }[]
  >;
  chartData: RepoStarData[];
  showTokenDialog: boolean;
  isFetching: boolean;
  height: number;
}

export default defineComponent({
  name: "StarChartViewer",
  components: { BytebaseBanner, StarChart, TokenSettingDialog },
  setup() {
    const state = reactive<State>({
      repoStarDataMap: new Map(),
      chartData: [],
      showTokenDialog: false,
      isFetching: false,
      height: window.innerHeight,
    });
    const store = useStore<AppState>();
    const containerElRef = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      const containerEl = containerElRef.value;

      if (containerEl) {
        state.height = window.innerHeight - containerEl.offsetTop - 24;
        containerEl.style.minHeight = state.height + "px";
      }
    });

    const fetchStarChart = async (repos: string[]) => {
      state.isFetching = true;
      store.commit("setFetchFlag", true);
      for (const repo of repos) {
        if (!state.repoStarDataMap.has(repo)) {
          try {
            const starRecords = await api.getRepoStarRecords(
              repo,
              store.state.token
            );
            state.repoStarDataMap.set(repo, starRecords);
          } catch (error: any) {
            if (error?.response?.status === 404) {
              toast.warn("Repo not found");
            } else if (error?.response?.status === 403) {
              toast.warn("GitHub API rate limit exceeded");
              state.showTokenDialog = true;
            } else if (Array.isArray(error?.data) && error.data?.length === 0) {
              toast.warn("Repo has no star history");
            } else {
              toast.warn("Request failed, please retry later");
            }
            store.commit("delRepo", repo);
            return;
          }
        }
      }
      state.isFetching = false;
      store.commit("setFetchFlag", false);

      const chartTempData: RepoStarData[] = [];
      for (const repo of repos) {
        const records = state.repoStarDataMap.get(repo);
        if (records) {
          chartTempData.push({
            repo,
            starRecords: records,
          });
        }
      }
      if (state.chartData.length > 0) {
        state.chartData.splice(0, state.chartData.length);
      }
      state.chartData = chartTempData;
    };

    const hideTokenDialog = () => {
      state.showTokenDialog = false;
      fetchStarChart(store.state.repos);
    };

    watch(store.state.repos, (repos) => {
      fetchStarChart(repos);
    });

    return {
      state,
      containerElRef,
      hideTokenDialog,
    };
  },
});
</script>
