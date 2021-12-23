<template>
  <div
    ref="containerElRef"
    class="w-full flex grow flex-col justify-center items-center"
  >
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
  height: number;
  showTokenDialog: boolean;
}

export default defineComponent({
  name: "StarChartViewer",
  components: { BytebaseBanner, StarChart, TokenSettingDialog },
  setup() {
    const state = reactive<State>({
      repoStarDataMap: new Map(),
      chartData: [],
      height: window.innerHeight,
      showTokenDialog: false,
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
      store.commit("setFetchFlag", true);
      try {
        for (const repo of repos) {
          if (!state.repoStarDataMap.has(repo)) {
            const starRecords = await api.getRepoStarRecords(
              repo,
              store.state.token
            );
            state.repoStarDataMap.set(repo, starRecords);
          }
        }
      } catch (error) {
        state.showTokenDialog = true;
        return;
      }
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

    watch(store.state.repos, () => {
      fetchStarChart(store.state.repos);
    });

    return {
      state,
      containerElRef,
      hideTokenDialog,
    };
  },
});
</script>
