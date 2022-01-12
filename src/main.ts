import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import { piniaInstance } from "./store";
import "./css/index.css";

const app = createApp(App);

app.use(router).use(piniaInstance).mount("#app");
