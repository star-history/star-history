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
    <!-- watermark -->
    <div
      v-if="state.isGeneratingImage"
      class="absolute right-6 bottom-6"
      style="font-family: xkcd"
    >
      star-history.com
    </div>
  </div>
  <div
    v-if="state.chartData.length > 0"
    class="relative mt-4 mb-8 w-full px-3 mx-auto max-w-4xl flex flex-row flex-wrap justify-end items-center"
  >
    <button
      :class="`shadow-inner ml-2 mb-2 rounded leading-9 px-4 cursor-pointer bg-green-500 text-white hover:bg-green-600 ${
        state.isGeneratingImage ? 'bg-green-600 cursor-not-allowed' : ''
      }`"
      @click="handleGenerateImageBtnClick"
    >
      Download Image
    </button>
    <button
      class="shadow-inner ml-2 mb-2 rounded leading-9 px-4 cursor-pointer bg-green-500 text-white hover:bg-green-600"
      @click="handleCopyLinkBtnClick"
    >
      Copy Link
    </button>
    <button
      class="shadow-inner ml-2 mb-2 rounded leading-9 px-4 cursor-pointer bg-green-500 text-white hover:bg-green-600"
      @click="handleExportAsCSVBtnClick"
    >
      Export as CSV
    </button>
  </div>
  <BytebaseBanner v-if="state.chartData.length > 0"></BytebaseBanner>
  <div class="grow shrink-0"></div>
  <TokenSettingDialog
    v-if="state.showSetTokenDialog"
    @close="handleSetTokenDialogClose"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { mapState, useStore } from "vuex";
import api from "../helpers/api";
import toast from "../helpers/toast";
import utils from "../helpers/utils";
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
  isGeneratingImage: boolean;
  showSetTokenDialog: boolean;
}

export default defineComponent({
  name: "StarChartViewer",
  components: { BytebaseBanner, StarChart, TokenSettingDialog },
  setup() {
    const state = reactive<State>({
      repoStarDataMap: new Map(),
      chartData: [],
      isGeneratingImage: false,
      showSetTokenDialog: false,
    });
    const store = useStore<AppState>();
    const containerElRef = ref<HTMLDivElement | null>(null);

    onMounted(() => {
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
              state.showSetTokenDialog = true;
            } else if (error?.response?.status === 401) {
              toast.warn("Access Token Unauthorized");
              state.showSetTokenDialog = true;
            } else if (Array.isArray(error?.data) && error.data?.length === 0) {
              toast.warn(`Repo ${repo} has no star history`);
            } else {
              toast.warn("Some unexpected error happened, try again later");
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
      toast.succeed("Link copied");
    };

    const handleGenerateImageBtnClick = () => {
      if (state.isGeneratingImage) {
        return;
      }
      state.isGeneratingImage = true;
      setTimeout(() => {
        if (containerElRef.value) {
          html2canvas(containerElRef.value, {
            scale: window.devicePixelRatio * 2,
          }).then((canvas) => {
            location.href = canvas.toDataURL();
            const link = document.createElement("a");
            link.download = "star-history.png";
            link.href = canvas.toDataURL();
            link.click();
            state.isGeneratingImage = false;
          });
        }
      });
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
      toast.succeed("CSV Downloaded");
    };

    const handleSetTokenDialogClose = () => {
      state.showSetTokenDialog = false;
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
      handleSetTokenDialogClose,
    };
  },
  computed: mapState({
    isFetching(state: AppState) {
      return state.isFetching;
    },
  }),
});
</script>
