import { createStore } from "vuex";
import { storage } from "../helpers/storage";

const store = createStore({
  state(): AppState {
    const { accessTokenCache } = storage.get(["accessTokenCache"]);
    const hash = window.location.hash.slice(1);
    const hashParams = hash.split("&");
    const repos: string[] = [];

    for (const p of hashParams) {
      if (p.startsWith("repos=")) {
        repos.push(...p.slice(6).split(","));
      }
    }

    return {
      isFetching: false,
      token: accessTokenCache || "",
      repos: repos,
    };
  },
  mutations: {
    addRepo(state: AppState, repo: string) {
      if (!state.repos.includes(repo)) {
        state.repos.push(repo);
      }
    },
    delRepo(state: AppState, repo: string) {
      if (state.repos.includes(repo)) {
        state.repos.splice(state.repos.indexOf(repo), 1);
      }
    },
    setToken(state: AppState, token: string) {
      state.token = token;
    },
    setFetchFlag(state: AppState, isFetching: boolean) {
      state.isFetching = isFetching;
    },
  },
});

export default store;
