<template>
  <div
    class="fixed w-full px-3 md:px-0 h-full flex flex-col justify-center items-center bg-black bg-opacity-60 z-50 top-0 left-0"
    :class="classname"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from "vue";

export default defineComponent({
  name: "Dialog",
  props: {
    classname: {
      type: String,
      default: "",
    },
  },
  setup() {
    onMounted(() => {
      document.body.classList.add("overflow-hidden");
    });

    onUnmounted(() => {
      document.body.classList.remove("overflow-hidden");
    });

    return {};
  },
});
</script>
