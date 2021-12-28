import { createApp } from "vue";
import store from "./store";
import App from "./App.vue";
import "./css/index.css";

const app = createApp(App);

app.use(store).mount("#app");
