import { createStore } from "vuex";
import { storage } from "../helpers/storage";

const store = createStore({
  state(): AppState {
    const { accessTokenCache } = storage.get(["accessTokenCache"]);

    return {
      isFetching: false,
      token: accessTokenCache || "",
      repos: [],
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
