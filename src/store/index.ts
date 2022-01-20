import { createPinia, defineStore } from "pinia";
import storage from "../helpers/storage";

export const piniaInstance = createPinia();

const useAppStore = defineStore("appStore", {
  state: (): AppState => {
    const { accessTokenCache } = storage.get(["accessTokenCache"]);
    const hash = window.location.hash.slice(1);
    const params = hash.split("&").filter((i) => Boolean(i));
    const repos: string[] = [];
    let chartMode: ChartMode = "Date";

    for (const value of params) {
      if (value === "Date" || value === "Timeline") {
        chartMode = value;
        continue;
      }
      if (!repos.includes(value)) {
        repos.push(value);
      }
    }

    return {
      isFetching: false,
      token: accessTokenCache || "",
      repos: repos,
      chartMode: chartMode,
    };
  },
  actions: {
    addRepo(repo: string) {
      if (!this.repos.includes(repo)) {
        this.repos.push(repo);
      }
      this.repos = [...this.repos];
    },
    delRepo(repo: string) {
      if (this.repos.includes(repo)) {
        this.repos.splice(this.repos.indexOf(repo), 1);
      }
      this.repos = [...this.repos];
    },
    setRepos(repos: string[]) {
      this.repos = repos;
    },
    setToken(token: string) {
      this.token = token;
    },
    setIsFetching(isFetching: boolean) {
      this.isFetching = isFetching;
    },
    setChartMode(chartMode: ChartMode) {
      this.chartMode = chartMode;
    },
  },
});

export default useAppStore;
