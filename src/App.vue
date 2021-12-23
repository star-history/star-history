<template>
  <div class="relative min-h-screen h-auto overflow-auto flex flex-col">
    <Header></Header>
    <RepoInputer></RepoInputer>
    <StarChartViewer></StarChartViewer>
    <Footer></Footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Footer from "./components/Footer.vue";
import Header from "./components/Header.vue";
import RepoInputer from "./components/RepoInputer.vue";
import StarChartViewer from "./components/StarChartViewer.vue";

export default defineComponent({
  name: "App",
  components: { Footer, Header, RepoInputer, StarChartViewer },
});
</script>
