<template>
  <a
    ref="containerElRef"
    class="relative w-full h-full min-w-600px min-h-400px p-4 pt-0 flex flex-col bg-white"
    :href="starHistoryLink"
    target="_blank"
  >
    <div
      v-if="state.isFetching"
      class="absolute w-full h-full flex justify-center items-center z-10 top-0"
    >
      <div class="absolute w-full h-full blur-md bg-white bg-opacity-80"></div>
      <i class="fas fa-spinner animate-spin text-4xl z-10"></i>
    </div>
    <StarXYChart
      v-if="state.chartData"
      classname="w-full h-auto"
      :data="state.chartData"
      :chart-mode="state.chartMode"
    />
  </a>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from "vue";
import { ChartMode, RepoStarData } from "../../types/chart";
import { XYChartData } from "../../packages/xy-chart";
import {
  convertStarDataToChartData,
  getReposStarData,
} from "../../common/chart";
import toast from "../helpers/toast";
import StarXYChart from "../components/Charts/StarXYChart.vue";

const toastWarn = (message: string) => {
  toast.warn(message, -1);
};

interface State {
  chartData: XYChartData | undefined;
  chartMode: ChartMode;
  isFetching: boolean;
  repos: string[];
}

const state = reactive<State>({
  chartData: undefined,
  chartMode: "Date",
  isFetching: true,
  repos: [],
});
const containerElRef = ref<HTMLDivElement | null>(null);
const starHistoryLink = computed(() => {
  return `https://star-history.com/#${state.repos.join("&")}&${
    state.chartMode
  }`;
});

onMounted(() => {
  if (!containerElRef.value) {
    return;
  }

  document.body
    .querySelector("#app")
    ?.setAttribute(
      "style",
      "position:absolute;width:100%;height:100%;top:0;left:0;background-color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;"
    );
  const bounding = containerElRef.value.getBoundingClientRect();
  let width = Math.min(bounding.width, bounding.height * 1.5);
  if (width < 600) {
    width = 600;
  }
  const height = width / 1.5;
  containerElRef.value.style.width = `${width}px`;
  containerElRef.value.style.height = `${height}px`;

  const search = window.location.search.slice(1);
  const hash = window.location.hash.slice(1);
  const params = hash.split("&").filter((i) => Boolean(i));
  const repos: string[] = [];
  let token = "";

  for (const s of search.split("&")) {
    if (s.startsWith("secret=")) {
      token = atob(s.slice(7));
      break;
    }
  }

  for (const value of params) {
    if (value === "Date" || value === "Timeline") {
      state.chartMode = value;
      continue;
    }
    if (!repos.includes(value)) {
      repos.push(value);
    }
  }

  state.repos = repos;
  fetchReposStarData(repos, token);
});

const fetchReposStarData = async (repos: string[], token: string) => {
  state.isFetching = true;
  const reposStarData: RepoStarData[] = [];
  try {
    const data = await getReposStarData(repos, token);
    for (const d of data) {
      reposStarData.push(d);
    }
  } catch (error: any) {
    toastWarn(error.message);
    return;
  }
  state.isFetching = false;

  if (reposStarData.length === 0) {
    state.chartData = undefined;
  } else {
    reposStarData.sort((d1, d2) => {
      return (
        Math.max(...d2.starRecords.map((s) => s.count)) -
        Math.max(...d1.starRecords.map((s) => s.count))
      );
    });
    state.chartData = convertStarDataToChartData(
      reposStarData,
      state.chartMode
    );
  }
};
</script>
