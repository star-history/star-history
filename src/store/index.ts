import { createStore } from "vuex";
import storage from "../helpers/storage";

const store = createStore({
  state(): AppState {
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
  mutations: {
    addRepo(state: AppState, repo: string) {
      if (!state.repos.includes(repo)) {
        state.repos.push(repo);
      }
      state.repos = [...state.repos];
    },
    delRepo(state: AppState, repo: string) {
      if (state.repos.includes(repo)) {
        state.repos.splice(state.repos.indexOf(repo), 1);
      }
      state.repos = [...state.repos];
    },
    setRepos(state: AppState, repos: string[]) {
      state.repos = repos;
    },
    setToken(state: AppState, token: string) {
      state.token = token;
    },
    setIsFetching(state: AppState, isFetching: boolean) {
      state.isFetching = isFetching;
    },
    setChartMode(state: AppState, chartMode: ChartMode) {
      state.chartMode = chartMode;
    },
  },
});

export default store;
