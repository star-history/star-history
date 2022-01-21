import { createRouter, createWebHistory } from "vue-router";
import EmbedWebSite from "../pages/EmbedWebSite.vue";
import Blog from "../pages/Blog.vue";
import BlogList from "../pages/BlogList.vue";
import Home from "../pages/Home.vue";
import NotFound from "../pages/404.vue";

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
    path: "/blog",
    name: "blog-list",
    component: BlogList,
  },
  {
    path: "/blog/:blogSlug",
    name: "blog-detail",
    component: Blog,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
