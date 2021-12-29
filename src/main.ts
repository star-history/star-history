import { createApp } from "vue";
import router from "./router";
import store from "./store";
import App from "./App.vue";
import "./css/index.css";

const app = createApp(App);

app.use(router).use(store).mount("#app");
