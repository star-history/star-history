<template>
  <div
    class="relative w-full h-full w-600px pt-0 flex flex-col justify-start items-center"
  >
    <div class="w-full p-2 px-4 flex flex-row justify-between items-center">
      <div class="flex flex-row justify-start items-center">
        <img class="w-7 h-auto" src="/icon.png" />
      </div>
      <div class="flex flex-row justify-start items-center">
        <span
          class="flex flex-row justify-center text-sm items-center cursor-pointer hover:opacity-70"
          @click="handleShowTokenDialog"
        >
          {{ token ? "Edit" : "Add" }} Access Token
        </span>
        <span
          class="h-full flex flex-row justify-center text-sm items-center cursor-pointer ml-3 hover:opacity-70"
          @click="handleOpenInWebsiteBtnClick"
        >
          Open in Website
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="external-link-alt"
            class="w-4 h-4 ml-1"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"
            ></path>
          </svg>
        </span>
      </div>
    </div>
    <div
      v-if="state.isLoading"
      class="absolute w-full h-full top-0 left-0 flex justify-center items-center z-10"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="spinner"
        class="animate-spin z-10 w-9 h-9"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path
          fill="currentColor"
          d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z"
        ></path>
      </svg>
    </div>
    <div
      v-if="state.message"
      class="w-full grow text-center text-2xl flex justify-center items-center"
    >
      {{ state.message }}
    </div>
    <div
      v-else-if="state.chartData"
      class="w-full px-2 flex flex-col justify-center items-center"
    >
      <StarXYChart classname="w-full h-auto" :data="state.chartData" />
      <!-- watermark -->
    </div>
    <div
      class="absolute left-0 bottom-1 w-full h-8 px-4 flex flex-row text-base justify-between items-center"
    >
      <span class="flex flex-row justify-start items-center">
        <a
          class="github-button"
          href="https://github.com/bytebase/star-history"
          data-show-count="true"
          aria-label="Star bytebase/star-history on GitHub"
          target="_blank"
        >
          Star
        </a>
      </span>
      <span
        class="h-full mb-1 flex flex-row justify-start items-center text-gray-500"
        style="font-family: 'xkcd', serif"
      >
        <img class="w-5 h-auto mr-1" src="/icon.png" />
        star-history.com
      </span>
    </div>
  </div>
  <TokenSettingDialog
    v-if="state.showSetTokenDialog"
    @close="handleSetTokenDialogClose"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";
import StarXYChart from "../components/Charts/StarXYChart.vue";
import TokenSettingDialog from "../components/TokenSettingDialog.vue";
import api from "../helpers/api";
import toast from "../helpers/toast";
import { XYChartData, XYData } from "../packages/xy-chart";
import useAppStore from "../store";

interface State {
  isLoading: boolean;
  repo: string;
  chartData: XYChartData | undefined;
  showSetTokenDialog: boolean;
  message: string;
}

const store = useAppStore();
const state = reactive<State>({
  isLoading: true,
  repo: "",
  chartData: undefined,
  showSetTokenDialog: false,
  message: "",
});

const token = computed(() => {
  return store.token;
});

onMounted(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    const url = tab.url + "/";

    try {
      const result = /github.com\/(\S+?\/\S+?)\//.exec(url);
      if (result) {
        state.repo = result[1];
        await fetchReposStarData([state.repo]);
      }
    } catch (err) {
      // do nth
    }

    if (!state.repo) {
      state.message = "No repo found";
    }

    state.isLoading = false;
  });
});

const fetchReposStarData = async (repos: string[]) => {
  state.isLoading = true;
  const reposStarData: RepoStarData[] = [];

  for (const repo of repos) {
    try {
      const starRecords = await api.getRepoStarRecords(repo, store.token);
      reposStarData.push({
        repo,
        starRecords: starRecords,
      });
    } catch (error: any) {
      if (error?.response?.status === 404) {
        state.message = `Repo ${repo} not found`;
      } else if (error?.response?.status === 403) {
        toast.warn("GitHub API rate limit exceeded");
        state.showSetTokenDialog = true;
      } else if (error?.response?.status === 401) {
        toast.warn("Access Token Unauthorized");
        state.showSetTokenDialog = true;
      } else if (Array.isArray(error?.data) && error.data?.length === 0) {
        state.message = `Repo ${repo} has no star history`;
      } else {
        state.message = "Some unexpected error happened, try again later";
      }
      return;
    }
  }
  state.isLoading = false;

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
};

const handleShowTokenDialog = () => {
  state.showSetTokenDialog = true;
};

const handleSetTokenDialogClose = () => {
  state.showSetTokenDialog = false;
};

const handleOpenInWebsiteBtnClick = () => {
  chrome.tabs.create({
    url: `https://star-history.com/#${state.repo}`,
  });
};
</script>
