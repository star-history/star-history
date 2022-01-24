<template>
  <div
    class="fixed z-100 top-0 left-0 transition-all duration-1000 w-full py-5 h-auto flex flex-row justify-center items-center drop-shadow-md"
    :class="`${bgColor} ${state.classname}`"
    @click="handleToastClick"
  >
    <p class="text-2xl" :class="textColor" v-html="message"></p>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";
import { ANIMATION_DURATION } from "../helpers/consts";

interface State {
  classname: string;
}

const props = defineProps({
  message: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "normal",
  },
  duration: {
    type: Number,
    default: 2000,
  },
  destory: {
    type: Function,
    default: () => undefined,
  },
});

const state = reactive<State>({
  classname: "",
});

const bgColor = computed(() => {
  switch (props.type) {
    case "normal":
      return "bg-black";
    case "warn":
      return "bg-orange-400";
    case "succeed":
      return "bg-green-600";
    case "error":
      return "bg-red-600";
  }
  return "bg-black";
});

const textColor = "text-white";

onMounted(() => {
  if (props.duration < 0) {
    return;
  }

  setTimeout(() => {
    destoryToast();
  }, props.duration);
});

const destoryToast = () => {
  if (props.duration < 0) {
    return;
  }

  state.classname = "-top-full";
  setTimeout(() => {
    if (props.destory) {
      props.destory();
    }
  }, ANIMATION_DURATION);
};

const handleToastClick = destoryToast;
</script>
