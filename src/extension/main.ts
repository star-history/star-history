import { createApp } from "vue";
import { piniaInstance } from "../store";
import Popup from "./Popup.vue";
import "../css/index.css";
import "../css/popup.css";

const app = createApp(Popup);

app.use(piniaInstance).mount("#app");
