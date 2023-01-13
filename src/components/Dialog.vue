<template>
  <div
    class="fixed w-full px-3 md:px-0 h-full flex flex-col justify-center items-center bg-black bg-opacity-60 z-100 top-0 left-0"
    :class="props.classname"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";

const props = defineProps({
  classname: {
    type: String,
    default: "",
  },
});

onMounted(() => {
  document.body.classList.add("overflow-hidden");
});

onUnmounted(() => {
  document.body.classList.remove("overflow-hidden");
});
</script>
