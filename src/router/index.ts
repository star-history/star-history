import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import NotFound from "../pages/NotFound.vue";
// NOTE: hide for this version
// import Blog from "../pages/Blog.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  // {
  //   path: "/blog",
  //   name: "blog",
  //   component: Blog,
  // },
  // {
  //   path: "/blog/:blogId",
  //   name: "article",
  //   component: Blog,
  // },
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
