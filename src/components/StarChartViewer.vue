<template>
  <div
    ref="containerElRef"
    class="w-full flex grow flex-col justify-center items-center"
  >
    <StarChart
      :width="Math.floor(state.height / 2) * 3"
      :height="Math.floor(state.height / 2) * 2"
      :data="state.chartData"
    ></StarChart>
    <BytebaseBanner v-if="state.chartData.length > 0"></BytebaseBanner>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import api from "../helpers/api";
import { AppState } from "../store";
import BytebaseBanner from "./BytebaseBanner.vue";
import StarChart from "./StarChart.vue";

interface State {
  repoStarDataMap: Map<
    string,
    {
      date: string;
      count: number;
    }[]
  >;
  chartData: {
    repo: string;
    starRecords: {
      date: string;
      count: number;
    }[];
  }[];
  height: number;
}

export default defineComponent({
  name: "StarChartViewer",
  components: { BytebaseBanner, StarChart },
  setup() {
    const state = reactive<State>({
      repoStarDataMap: new Map(),
      chartData: [],
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
        console.error(error);
      }
      store.commit("setFetchFlag", false);
      const chartTempData: any[] = [];
      for (const [k, v] of state.repoStarDataMap) {
        chartTempData.push({
          repo: k,
          starRecords: v,
        });
      }
      state.chartData = chartTempData;
    };

    watch(store.state.repos, (repos) => {
      fetchStarChart(repos);
    });

    return {
      state,
      containerElRef,
    };
  },
});
</script>
