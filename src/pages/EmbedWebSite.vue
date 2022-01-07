<template>
  <div
    ref="containerElRef"
    class="relative w-full h-full min-w-600px min-h-400px p-4 pt-0 flex flex-col bg-white"
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
    <div
      v-if="state.chartData"
      class="w-full h-8 -mt-6 pr-2 flex flex-row justify-end items-center text-gray-600 cursor-pointer hover:text-dark"
      style="font-family: 'xkcd', serif"
      @click="handleWaterMarkClick"
    >
      <img class="w-5 h-auto mr-1" src="/icon.png" />
      star-history.com
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import api from "../helpers/api";
import toast from "../helpers/toast";
import utils from "../helpers/utils";
import { XYChartData, XYData } from "../packages/xy-chart";
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

export default defineComponent({
  name: "EmbedWebSite",
  components: { StarXYChart },
  setup: () => {
    const state = reactive<State>({
      chartData: undefined,
      chartMode: "Date",
      isFetching: true,
      repos: [],
    });
    const containerElRef = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      if (!containerElRef.value) {
        return;
      }

      document.body
        .querySelector("#app")
        ?.setAttribute(
          "style",
          "position: absolute;width:100%;height:100%;top:0;left:0;background-color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;"
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

      for (const repo of repos) {
        try {
          const starRecords = await api.getRepoStarRecords(repo, token);
          reposStarData.push({
            repo,
            starRecords,
          });
        } catch (error: any) {
          if (error?.response?.status === 404) {
            toastWarn(`Repo ${repo} not found`);
          } else if (error?.response?.status === 403) {
            toastWarn("GitHub API rate limit exceeded");
          } else if (error?.response?.status === 401) {
            toastWarn("Access Token Unauthorized");
          } else if (Array.isArray(error?.data) && error.data?.length === 0) {
            toastWarn(`Repo ${repo} has no star history`);
          } else {
            toastWarn("Some unexpected error happened, try again later");
          }
          return;
        }
      }
      state.isFetching = false;

      if (reposStarData.length === 0) {
        state.chartData = undefined;
        toastWarn(`No repo found`);
      } else {
        reposStarData.sort((d1, d2) => {
          return (
            Math.max(...d2.starRecords.map((s) => s.count)) -
            Math.max(...d1.starRecords.map((s) => s.count))
          );
        });
        generateChartData(reposStarData);
      }
    };

    const generateChartData = (reposStarData: RepoStarData[]) => {
      if (state.chartMode === "Date") {
        const datasets: XYData[] = reposStarData.map((item) => {
          const { repo, starRecords } = item;

          return {
            label: repo,
            data: starRecords.map((item) => {
              return {
                x: new Date(item.date),
                y: Number(item.count),
              };
            }),
          };
        });
        state.chartData = {
          datasets,
        } as XYChartData;
      } else if (state.chartMode === "Timeline") {
        const datasets: XYData[] = reposStarData.map((item) => {
          const { repo, starRecords } = item;

          let started = starRecords[0].date;

          return {
            label: repo,
            data: starRecords.map((item) => {
              return {
                x:
                  utils.getTimeStampByDate(new Date(item.date)) -
                  utils.getTimeStampByDate(new Date(started)),
                y: Number(item.count),
              };
            }),
          };
        });
        state.chartData = {
          datasets,
        } as XYChartData;
      }
    };

    const handleWaterMarkClick = () => {
      const starHistoryLink = `https://star-history.com/#${state.repos.join(
        "&"
      )}&${state.chartMode}`;
      const link = document.createElement("a");
      link.href = starHistoryLink;
      link.target = "_blank";
      link.click();
    };

    return {
      state,
      containerElRef,
      handleWaterMarkClick,
    };
  },
});
</script>
