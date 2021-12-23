import { createStore } from "vuex";

export interface AppState {
  token: string;
  repos: string[];
}

const store = createStore({
  state(): AppState {
    return {
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
  },
});

export default store;
