<template>
  <div
    ref="containerElRef"
    class="relative w-fit p-4 pt-0 flex grow flex-col justify-center items-center self-center"
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
  </div>
  <div
    v-if="state.chartData.length > 0"
    class="relative mt-6 mb-6 w-auto m-auto border-b p-2 drop-shadow flex grow flex-row justify-center items-center"
  >
    <span>Share with:</span>
    <span
      class="border ml-2 rounded-md p-1 pl-3 pr-3 cursor-pointer hover:border-black"
      @click="handleCopyLinkBtnClick"
    >
      <i class="fas fa-link"></i> Link
    </span>
    <span
      class="border ml-2 rounded-md p-1 pl-3 pr-3 cursor-pointer hover:border-black"
      @click="handleGenerateImageBtnClick"
    >
      <i class="far fa-image"></i> Image
    </span>
  </div>
  <BytebaseBanner v-if="state.chartData.length > 0"></BytebaseBanner>
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
