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
    <div
      v-if="state.chartData"
      class="absolute top-0 right-1 p-2 flex flex-row"
    >
      <div
        class="flex flex-row justify-center items-center rounded leading-8 text-sm px-3 cursor-pointer text-dark select-none hover:bg-gray-100"
        @click="handleToggleChartBtnClick"
      >
        <input
          class="mr-2"
          type="checkbox"
          :checked="chartMode === 'Timeline'"
        />
        Align timeline
      </div>
    </div>
    <StarXYChart
      v-if="state.chartData"
      classname="w-full h-auto"
      :data="state.chartData"
      :chart-mode="chartMode"
    />

    <!-- watermark -->
    <div
      v-if="state.chartData"
      class="w-full h-8 -mt-6 pr-2 flex flex-row justify-end items-center text-gray-500"
      style="font-family: 'xkcd', serif"
    >
      <img class="w-5 h-auto mr-1" src="/icon.png" />
      star-history.com
    </div>
  </div>
  <div
    v-if="state.chartData"
    class="relative mt-4 mb-8 w-full px-3 mx-auto max-w-4xl flex flex-row flex-wrap justify-between items-center"
  >
    <div class="flex flex-row justify-start items-center mb-2">
      <a
        class="h-full flex flex-row justify-center items-center leading-8 hover:opacity-80 underline underline-offset-2 mb-2 decoration-dark"
        href="https://chrome.google.com/webstore/detail/iijibbcdddbhokfepbblglfgdglnccfn"
        target="_blank"
      >
        <img class="w-5 h-auto mr-1" src="/icons/free.svg" />
        <span class="text-dark">Get Chrome Extension</span>
      </a>
    </div>
    <div class="flex flex-row flex-wrap justify-end items-center mb-2">
      <button
        class="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200"
        :class="state.isGeneratingImage ? 'bg-gray-200 cursor-wait' : ''"
        @click="handleGenerateImageBtnClick"
      >
        <i class="fas fa-download"></i>
        Image
      </button>
      <button
        class="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200"
        @click="handleExportAsCSVBtnClick"
      >
        <i class="fas fa-download"></i>
        CSV
      </button>
      <button
        class="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200"
        @click="handleGenEmbedCodeDialogBtnClick"
      >
        <i class="fas fa-code"></i>
        Embed
      </button>
      <button
        class="ml-2 mb-2 rounded leading-9 text-sm px-3 cursor-pointer border text-dark bg-gray-100 hover:bg-gray-200"
        @click="handleCopyLinkBtnClick"
      >
        <i class="far fa-copy"></i>
        Link
      </button>
      <button
        class="shadow-inner ml-2 mb-2 rounded leading-9 px-4 cursor-pointer bg-green-600 border border-transparent text-white hover:bg-green-700"
        @click="handleShareToTwitterBtnClick"
      >
        <i class="relative -bottom-px fab fa-twitter"></i>
        Share on Twitter
      </button>
    </div>
  </div>
  <div class="grow"></div>
  <BytebaseBanner v-if="state.chartData"></BytebaseBanner>
  <TokenSettingDialog
    v-if="state.showSetTokenDialog"
    @close="handleSetTokenDialogClose"
  />
  <GenerateEmbedCodeDialog
    v-if="state.showGenEmbedCodeDialog"
    @close="handleGenEmbedCodeDialogClose"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import api from "../helpers/api";
import toast from "../helpers/toast";
import utils from "../helpers/utils";
import { XYChartData, XYData } from "../packages/xy-chart";
import BytebaseBanner from "./BytebaseBanner.vue";
import StarXYChart from "./Charts/StarXYChart.vue";
import TokenSettingDialog from "./TokenSettingDialog.vue";
import GenerateEmbedCodeDialog from "./GenerateEmbedCodeDialog.vue";
import useAppStore from "../store";

interface State {
  chartMode: "Date" | "Timeline";
  repoStarDataMap: Map<
    string,
    {
      date: string;
      count: number;
    }[]
  >;
  chartData: XYChartData | undefined;
  isGeneratingImage: boolean;
  showSetTokenDialog: boolean;
  showGenEmbedCodeDialog: boolean;
}

const state = reactive<State>({
  chartMode: "Date",
  repoStarDataMap: new Map(),
  chartData: undefined,
  isGeneratingImage: false,
  showSetTokenDialog: false,
  showGenEmbedCodeDialog: false,
});
const store = useAppStore();

const containerElRef = ref<HTMLDivElement | null>(null);

const isFetching = computed(() => {
  return store.isFetching;
});
const chartMode = computed(() => {
  return store.chartMode;
});

onMounted(() => {
  if (store.repos.length > 0) {
    fetchReposStarData(store.repos);
  }
});

watch(
  () => store.repos,
  () => {
    fetchReposStarData(store.repos);
  }
);

const fetchReposStarData = async (repos: string[]) => {
  store.setIsFetching(true);
  for (const repo of repos) {
    if (!state.repoStarDataMap.has(repo)) {
      try {
        const starRecords = await api.getRepoStarRecords(repo, store.token);
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
        store.delRepo(repo);
        return;
      }
    }
  }
  store.setIsFetching(false);

  const reposStarData: RepoStarData[] = [];
  for (const repo of store.repos) {
    const records = state.repoStarDataMap.get(repo);
    if (records) {
      reposStarData.push({
        repo,
        starRecords: records,
      });
    }
  }

  if (reposStarData.length === 0) {
    state.chartData = undefined;
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
  if (chartMode.value === "Date") {
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
  } else if (chartMode.value === "Timeline") {
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

const handleCopyLinkBtnClick = async () => {
  await utils.copyTextToClipboard(window.location.href);
  toast.succeed("Link copied");
};

const handleGenerateImageBtnClick = async () => {
  if (state.isGeneratingImage) {
    return;
  }

  const svgElement = containerElRef.value
    ?.querySelector("svg")
    ?.cloneNode(true) as SVGSVGElement;
  svgElement.querySelectorAll(".chart-tooltip-dot").forEach((d) => d.remove());
  svgElement.setAttribute("class", "fixed -z-10");
  document.body.append(svgElement);

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
  svgElement.remove();
};

const handleExportAsCSVBtnClick = () => {
  let CSVContent = "";
  for (const repo of store.repos) {
    const records = state.repoStarDataMap.get(repo);
    if (records) {
      const temp: any[] = [];
      for (const i of records) {
        temp.push([repo, new Date(i.date), i.count]);
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

const handleShareToTwitterBtnClick = async () => {
  const repos = store.repos;
  if (repos.length === 0) {
    toast.error("No repo found");
    return;
  }

  const starhistoryLink = encodeURIComponent(window.location.href);
  let text = "";

  if (repos.length === 1) {
    const repo = repos[0];
    let starCount = 0;

    try {
      const { data } = await api.getRepoStargazersCount(repo, store.token);
      starCount = data.stargazers_count;
    } catch (error) {
      // do nth
    }

    let starText = "";
    if (starCount > 0) {
      starText = `${
        starCount < 1000 ? starCount : (starCount / 1000).toFixed(1) + "K ⭐️ "
      }`;
    }
    text = `${starText}Thank you! 🙏%0A${starhistoryLink}%0A%0A`;
  } else {
    text = repos.join(" vs ") + "%0A%0A";
  }

  const addtionLink =
    repos.length === 1 ? `github.com/${repos[0]}` : starhistoryLink;
  text += `${addtionLink}%0A%0A`;
  text += `${encodeURIComponent("#starhistory #GitHub #OpenSource ")}`;
  const tweetShareLink = `https://twitter.com/intent/tweet?text=${text}%0A&via=StarHistoryHQ`;
  const link = document.createElement("a");
  link.href = tweetShareLink;
  link.target = "_blank";
  link.click();
};

const handleGenEmbedCodeDialogBtnClick = () => {
  state.showGenEmbedCodeDialog = true;
};

const handleGenEmbedCodeDialogClose = () => {
  state.showGenEmbedCodeDialog = false;
};

const handleToggleChartBtnClick = () => {
  store.setChartMode(chartMode.value === "Date" ? "Timeline" : "Date");
  fetchReposStarData(store.repos);
};

const handleSetTokenDialogClose = () => {
  state.showSetTokenDialog = false;
};
</script>
