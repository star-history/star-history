<template>
  <div class="relative w-full h-auto min-h-screen overflow-auto flex flex-col">
    <Header />
    <div class="w-full h-auto grow lg:grid lg:grid-cols-[256px_1fr_256px]">
      <div class="w-full hidden lg:block">
        <HighlightBlogSection />
      </div>
      <div class="w-full flex flex-col justify-start items-center">
        <RepoInputer />
        <StarChartViewer />
      </div>
      <div class="hidden lg:block"></div>
    </div>
    <Footer />
    <SponsorBanner />
  </div>
</template>

<script lang="ts" setup>
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import RepoInputer from "../components/RepoInputer.vue";
import StarChartViewer from "../components/StarChartViewer.vue";
import SponsorBanner from "../components/SponsorBanner.vue";
import HighlightBlogSection from "../components/HighlightBlogSection.vue";
</script>
