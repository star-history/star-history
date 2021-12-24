<template>
  <div
    :class="
      'fixed z-50 top-0 left-0 w-full h-20 flex flex-row justify-center items-center ' +
      bgColor
    "
  >
    <p :class="'text-3xl ' + textColor">{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Toast",
  props: {
    message: {
      type: String,
    },
    type: {
      type: String,
      default: "normal",
    },
  },
  setup() {
    return {};
  },
  computed: {
    bgColor() {
      switch (this.$props.type) {
        case "normal":
          return "bg-black";
        case "warn":
          return "bg-orange-500";
        case "succeed":
          return "bg-green-800";
      }
      return "bg-black";
    },
    textColor() {
      switch (this.$props.type) {
        case "normal":
          return "text-white";
        case "warn":
          return "text-white";
        case "succeed":
          return "text-white";
      }
      return "text-white";
    },
  },
});
</script>
