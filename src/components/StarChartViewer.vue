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

    <!-- Bytebase -->
    <div
      v-if="state.chartData.length > 0"
      class="w-full mt-8 mb-8 text-sm flex grow flex-col justify-center items-center"
    >
      <p class="font-bold h-7">
        Sponsored by
        <a class="text-cyan-700" href="https://bytebase.com" target="__blank"
          >Bytebase</a
        >
      </p>
      <p class="h-7">
        Open source, web-based database schema change and version control for
        <span class="font-bold text-cyan-700">Teams</span>
      </p>
      <a class="" href="https://bytebase.com/" target="__blank">
        <img class="w-auto max-w-2xl" src="/bytebase.webp" alt="bytebase" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import api from "../helpers/api";
import { AppState } from "../store";
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
  components: { StarChart },
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
        state.height = window.innerHeight - containerEl.offsetTop;
        containerEl.style.minHeight = state.height + "px";
      }
    });

    const fetchStarChart = async (repos: string[]) => {
      for (const repo of repos) {
        if (!state.repoStarDataMap.has(repo)) {
          const starRecords = await api.getRepoStarRecords(repo);
          state.repoStarDataMap.set(repo, starRecords);
        }
      }
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
