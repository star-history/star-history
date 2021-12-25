<template>
  <div
    ref="containerElRef"
    class="relative w-full px-3 mx-auto max-w-800px 2xl:max-w-4xl p-4 pt-0 flex flex-col justify-center items-center"
  >
    <div
      v-if="state.isFetching"
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
    class="relative mt-4 mb-8 w-full px-3 mx-auto max-w-800px 2xl:max-w-4xl flex flex-row justify-end items-center"
  >
    <span
      class="shadow-inner ml-2 rounded leading-9 px-4 cursor-pointer bg-green-500 text-light opacity-90 hover:opacity-100"
      @click="handleCopyLinkBtnClick"
    >
      Copy Link
    </span>
    <span
      class="shadow-inner ml-2 rounded leading-9 px-4 cursor-pointer bg-green-500 text-light opacity-90 hover:opacity-100"
      @click="handleGenerateImageBtnClick"
    >
      Download Image
    </span>
  </div>
  <BytebaseBanner v-if="state.chartData.length > 0"></BytebaseBanner>
  <div class="grow shrink-0"></div>
  <TokenSettingDialog
    v-if="state.showTokenDialog"
    :destory="hideTokenDialog"
  ></TokenSettingDialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
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
  showTokenDialog: boolean;
  isFetching: boolean;
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
              toast.warn(`Repo ${repo} not found`);
            } else if (error?.response?.status === 403) {
              toast.warn("GitHub API rate limit exceeded");
              state.showTokenDialog = true;
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

    const handleCopyLinkBtnClick = async () => {
      await utils.copyTextToClipboard(window.location.href);
      toast.succeed("Copy succeed");
    };

    const handleGenerateImageBtnClick = () => {
      if (containerElRef.value) {
        html2canvas(containerElRef.value, {
          scale: window.devicePixelRatio * 2,
        }).then((canvas) => {
          // NOTE: download it, and the ImageViewer is WIP.
          location.href = canvas.toDataURL();
          const link = document.createElement("a");
          link.download = "star-history.png";
          link.href = canvas.toDataURL();
          link.click();
        });
      }
    };

    watch(store.state.repos, (repos) => {
      fetchStarChart(repos);
    });

    return {
      state,
      containerElRef,
      hideTokenDialog,
      handleCopyLinkBtnClick,
      handleGenerateImageBtnClick,
    };
  },
});
</script>
