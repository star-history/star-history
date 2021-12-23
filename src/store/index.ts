import { createStore } from "vuex";

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
    delRepo(state: AppState, repo: string) {
      if (state.repos.includes(repo)) {
        state.repos = state.repos.filter((t) => t !== repo);
      }
    },
    setFetchFlag(state: AppState, isFetching: boolean) {
      state.isFetching = isFetching;
    },
  },
});

export default store;
