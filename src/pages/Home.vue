<template>
  <div class="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
    <Header />
    <RepoInputer />
    <StarChartViewer />
    <Footer />

    <SponsorBanner />
    <BlogBanner />
  </div>
</template>

<script lang="ts" setup>
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import RepoInputer from "../components/RepoInputer.vue";
import StarChartViewer from "../components/StarChartViewer.vue";
import SponsorBanner from "../components/SponsorBanner.vue";
import BlogBanner from "../components/BlogBanner.vue";
</script>
