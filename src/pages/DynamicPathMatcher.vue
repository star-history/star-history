<template>
  <p>
    <!-- do nth -->
  </p>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

onMounted(() => {
  const pathList = route.params.pathList;
  if (Array.isArray(pathList) && pathList.length >= 2) {
    router.push({ path: `/`, hash: `#${pathList[0]}/${pathList[1]}` });
  } else {
    router.push({ path: "/404" });
  }
});
</script>
