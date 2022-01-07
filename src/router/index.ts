import { createRouter, createWebHistory } from "vue-router";
import EmbedWebSite from "../pages/EmbedWebSite.vue";
import Home from "../pages/Home.vue";
import NotFound from "../pages/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/embed",
    name: "embed-website",
    component: EmbedWebSite,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not_found",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
