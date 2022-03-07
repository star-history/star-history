import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../pages/Home.vue"),
  },
  {
    path: "/embed",
    name: "embed-website",
    component: () => import("../pages/EmbedWebSite.vue"),
  },
  {
    path: "/blog",
    name: "blog-list",
    component: () => import("../pages/BlogList.vue"),
  },
  {
    path: "/blog/:blogSlug",
    name: "blog-detail",
    component: () => import("../pages/Blog.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../pages/404.vue"),
  },
  {
    path: "/:pathList(.*)*",
    name: "dynamic-path-matcher",
    component: () => import("../pages/DynamicPathMatcher.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
