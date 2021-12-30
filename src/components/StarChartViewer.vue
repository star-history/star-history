<template>
  <div
    ref="containerElRef"
    class="relative w-full h-auto self-center min-w-600px max-w-800px min-h-400px 2xl:max-w-4xl p-4 pt-0 flex flex-col"
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
      v-if="state.chartData.length > 0"
      class="w-full h-8 -mt-6 pr-2 flex flex-row justify-end items-center text-gray-500"
      style="font-family: 'xkcd', serif"
    >
      <img class="w-5 h-auto mr-1" src="/icon.png" />
      star-history.com
    </div>
  </div>
  <div
    v-if="state.chartData.length > 0"
    class="relative mt-4 mb-8 w-full px-3 mx-auto max-w-4xl flex flex-row flex-wrap justify-between items-center"
  >
    <div class="flex flex-row justify-start items-center mb-2">
      <a
        class="h-full flex flex-row justify-center items-center hover:opacity-80 underline underline-offset-2 decoration-dark"
        href="https://chrome.google.com/webstore/detail/iijibbcdddbhokfepbblglfgdglnccfn"
        target="_blank"
      >
        <img class="w-5 h-auto mr-1" src="/icons/free.svg" />
        <span class="text-dark">Get Chrome Extension</span>
      </a>
    </div>
    <div class="flex flex-row justify-end items-center mb-2">
      <button
        class="`shadow-inner ml-2 mb-2 rounded leading-9 px-4 cursor-pointer bg-green-500 text-white hover:bg-green-600"
        :class="state.isGeneratingImage ? 'bg-green-600 cursor-wait' : ''"
        @click="handleGenerateImageBtnClick"
      >
        Download Image
      </button>
      <button
        class="shadow-inner ml-2 mb-2 rounded leading-9 px-4 cursor-pointer bg-green-500 text-white hover:bg-green-600"
        @click="handleShareToTwitterBtnClick"
      >
        Share to Twitter
      </button>
      <!-- <button
        class="shadow-inner ml-2 mb-2 rounded leading-9 px-4 cursor-pointer bg-green-500 text-white hover:bg-green-600"
        @click="handleCopyLinkBtnClick"
      >
        Copy Link
      </button> -->
      <button
        class="shadow-inner ml-2 mb-2 rounded leading-9 px-4 cursor-pointer bg-green-500 text-white hover:bg-green-600"
        @click="handleExportAsCSVBtnClick"
      >
        Export as CSV
      </button>
    </div>
  </div>
  <div class="grow"></div>
  <BytebaseBanner v-if="state.chartData.length > 0"></BytebaseBanner>
  <TokenSettingDialog
    v-if="state.showSetTokenDialog"
    @close="handleSetTokenDialogClose"
  />
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
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
    const isFetching = computed(() => {
      return store.state.isFetching;
    });

    onMounted(() => {
      if (store.state.repos.length > 0) {
        fetchStarChart(store.state.repos);
      }
    });

    watch(
      () => store.state.repos,
      () => {
        fetchStarChart(store.state.repos);
      }
    );

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
      state.chartData = chartTempData;
    };

    const handleCopyLinkBtnClick = async () => {
      await utils.copyTextToClipboard(window.location.href);
      toast.succeed("Link copied");
    };

    const handleGenerateImageBtnClick = async () => {
      if (state.isGeneratingImage) {
        return;
      }

      const svgElement = containerElRef.value?.querySelector("svg");

      if (!svgElement || !containerElRef.value) {
        toast.warn("Chart element not found, please try later");
        return;
      }

      state.isGeneratingImage = true;

      let destoryGeneratingToast = () => {
        // do nth
      };
      setTimeout(() => {
        if (state.isGeneratingImage) {
          const cbs = toast.warn(
            `<i class="fas fa-spinner animate-spin text-2xl mr-3"></i>Generating image`,
            -1
          );
          destoryGeneratingToast = cbs.destory;
        }
      }, 2000);

      try {
        const { clientWidth, clientHeight } = svgElement;
        const canvas = document.createElement("canvas");
        const scale = Math.floor(window.devicePixelRatio * 2);
        canvas.width = (clientWidth + 20) * scale;
        canvas.height = (clientHeight + 30) * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          toast.warn("Get canvas context failed.");
          return;
        }
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // draw chart image
        const chartDataURL = utils.convertSVGToDataURL(svgElement);
        const chartImage = new Image();
        chartImage.src = chartDataURL;
        await utils.waitImageLoaded(chartImage);
        ctx.drawImage(
          chartImage,
          10 * scale,
          10 * scale,
          clientWidth * scale,
          clientHeight * scale
        );
        // draw website link text
        ctx.font = `${16 * scale}px xkcd`;
        ctx.fillStyle = "#6b7280";
        ctx.fillText(
          "star-history.com",
          (clientWidth - 130) * scale,
          (clientHeight + 10) * scale
        );
        // draw star image
        const starImage = new Image();
        starImage.src = "/icon.png";
        await utils.waitImageLoaded(starImage);
        ctx.drawImage(
          starImage,
          (clientWidth - 155) * scale,
          (clientHeight - 5) * scale,
          20 * scale,
          20 * scale
        );

        const link = document.createElement("a");
        link.download = `star-history-${utils.getDateString(
          Date.now(),
          "yyyyMMdd"
        )}.png`;
        link.href = canvas.toDataURL();
        link.click();
        state.isGeneratingImage = false;
        destoryGeneratingToast();
        toast.succeed("Image Downloaded");
      } catch (error) {
        console.error(error);
        toast.error("Generate image failed");
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
      link.download = `star-history-${utils.getDateString(
        Date.now(),
        "yyyyMMdd"
      )}.csv`;
      link.href = encodedUri;
      link.click();
      toast.succeed("CSV Downloaded");
    };

    const handleShareToTwitterBtnClick = () => {
      const tweetShareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        window.location.href
      )}&text=${store.state.repos.join(",+")}&hashtags=starhistory`;
      const link = document.createElement("a");
      link.href = tweetShareLink;
      link.target = "_blank";
      link.click();
    };

    const handleSetTokenDialogClose = () => {
      state.showSetTokenDialog = false;
    };

    return {
      state,
      containerElRef,
      isFetching,
      handleCopyLinkBtnClick,
      handleShareToTwitterBtnClick,
      handleGenerateImageBtnClick,
      handleExportAsCSVBtnClick,
      handleSetTokenDialogClose,
    };
  },
});
</script>
