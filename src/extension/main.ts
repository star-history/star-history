import { createApp } from "vue";
import store from "../store";
import Popup from "./Popup.vue";
import "../css/index.css";
import "../css/popup.css";

const app = createApp(Popup);

app.use(store).mount("#app");
