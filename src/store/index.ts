import { createStore } from "vuex";
import { storage } from "../helpers/storage";

const store = createStore({
  state(): AppState {
    const { accessTokenCache } = storage.get(["accessTokenCache"]);
    const hash = window.location.hash.slice(1);
    const rawRepos = hash.split("&").filter((i) => Boolean(i));
    const repos: string[] = [];
    for (const repo of rawRepos) {
      if (!repos.includes(repo)) {
        repos.push(repo);
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
      state.repos = [...state.repos];
    },
    delRepo(state: AppState, repo: string) {
      if (state.repos.includes(repo)) {
        state.repos.splice(state.repos.indexOf(repo), 1);
      }
      state.repos = [...state.repos];
    },
    clearAll(state: AppState) {
      state.repos = [];
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
