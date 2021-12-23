import { createStore } from "vuex";

export interface AppState {
  isFetching: boolean;
  token: string;
  repos: string[];
}

const store = createStore({
  state(): AppState {
    return {
      isFetching: false,
      token: "",
      repos: [],
    };
  },
  mutations: {
    addRepo(state: AppState, repo: string) {
      if (!state.repos.includes(repo)) {
        state.repos.push(repo);
      }
    },
    setFetchFlag(state: AppState, isFetching: boolean) {
      state.isFetching = isFetching;
    },
  },
});

export default store;
