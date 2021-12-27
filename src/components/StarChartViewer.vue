<template>
  <div
    ref="containerElRef"
    class="relative w-full px-3 mx-auto max-w-800px 2xl:max-w-4xl p-4 pt-0 flex flex-col justify-center items-center"
  >
    <div
      v-if="isFetching"
      class="absolute w-full h-full flex justify-center items-center z-10 top-0"
    >
      <div class="absolute w-full h-full blur-md bg-white bg-opacity-80"></div>
      <i class="fas fa-spinner animate-spin text-4xl z-10"></i>
    </div>
    <StarChart
      v-if="state.chartData.length > 0"
      classname="w-full h-auto"
      :data="state.chartData"
    ></StarChart>
  </div>
  <div
    v-if="state.chartData.length > 0"
    class="relative mt-4 mb-8 w-full px-3 mx-auto max-w-800px 2xl:max-w-4xl flex flex-row flex-wrap justify-end items-center"
  >
    <span
      class="shadow-inner ml-2 mb-2 rounded leading-9 px-4 cursor-pointer bg-green-500 text-white hover:bg-green-600"
      @click="handleCopyLinkBtnClick"
    >
      Copy Link
    </span>
    <span
      class="shadow-inner ml-2 mb-2 rounded leading-9 px-4 cursor-pointer bg-green-500 text-white hover:bg-green-600"
      @click="handleGenerateImageBtnClick"
    >
      Download Image
    </span>
    <span
      class="shadow-inner ml-2 mb-2 rounded leading-9 px-4 cursor-pointer bg-green-500 text-white hover:bg-green-600"
      @click="handleExportAsCSVBtnClick"
    >
      Export as CSV
    </span>
  </div>
  <BytebaseBanner v-if="state.chartData.length > 0"></BytebaseBanner>
  <div class="grow shrink-0"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { mapState, useStore } from "vuex";
import api from "../helpers/api";
import toast from "../helpers/toast";
import utils from "../helpers/utils";
import BytebaseBanner from "./BytebaseBanner.vue";
import StarChart from "./StarChart.vue";
import { showSetTokenDialog } from "./TokenSettingDialog.vue";

interface State {
  repoStarDataMap: Map<
    string,
    {
      date: string;
      count: number;
    }[]
  >;
  chartData: RepoStarData[];
}

export default defineComponent({
  name: "StarChartViewer",
  components: { BytebaseBanner, StarChart },
  setup() {
    const state = reactive<State>({
      repoStarDataMap: new Map(),
      chartData: [],
    });
    const store = useStore<AppState>();
    const containerElRef = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      const containerEl = containerElRef.value;

      if (containerEl) {
        containerEl.style.minHeight = (containerEl.clientWidth / 3) * 2 + "px";
      }

      if (store.state.repos.length > 0) {
        fetchStarChart(store.state.repos);
      }
    });

    const fetchStarChart = async (repos: string[]) => {
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
              toast.warn(`Repo ${repo} not found`);
            } else if (error?.response?.status === 403) {
              toast.warn("GitHub API rate limit exceeded");
              showSetTokenDialog();
            } else if (Array.isArray(error?.data) && error.data?.length === 0) {
              toast.warn(`Repo ${repo} has no star history`);
            } else {
              toast.warn("Request failed, please retry later");
            }
            store.commit("delRepo", repo);
            return;
          }
        }
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

    const handleCopyLinkBtnClick = async () => {
      await utils.copyTextToClipboard(window.location.href);
      toast.succeed("Copy succeed");
    };

    const handleGenerateImageBtnClick = () => {
      if (containerElRef.value) {
        html2canvas(containerElRef.value, {
          scale: window.devicePixelRatio * 2,
        }).then((canvas) => {
          location.href = canvas.toDataURL();
          const link = document.createElement("a");
          link.download = "star-history.png";
          link.href = canvas.toDataURL();
          link.click();
        });
      }
    };

    const handleExportAsCSVBtnClick = () => {
      let CSVContent = "";
      for (const d of state.chartData) {
        const temp: any[] = [];
        for (const i of d.starRecords) {
          temp.push([d.repo, new Date(i.date), i.count]);
        }
        CSVContent += temp
          .map((item) =>
            typeof item === "string" && item.indexOf(",") >= 0
              ? `"${item}"`
              : String(item)
          )
          .join("\n");
        CSVContent += "\n";
      }
      const encodedUri = encodeURI("data:text/csv;charset=utf-8," + CSVContent);
      const link = document.createElement("a");
      link.download = "star-history.csv";
      link.href = encodedUri;
      link.click();
    };

    watch(store.state.repos, (repos) => {
      fetchStarChart(repos);
    });

    return {
      state,
      containerElRef,
      handleCopyLinkBtnClick,
      handleGenerateImageBtnClick,
      handleExportAsCSVBtnClick,
    };
  },
  computed: mapState({
    isFetching(state: AppState) {
      return state.isFetching;
    },
  }),
});
</script>
