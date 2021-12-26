<template>
  <div
    :class="
      'fixed w-full px-3 md:px-0 h-full flex flex-col justify-center items-center bg-black bg-opacity-60 z-50 top-0 left-0 ' +
      classname
    "
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { createApp, DefineComponent, defineComponent } from "vue";
import store from "../store";

const Dialog = defineComponent({
  name: "Dialog",
  props: {
    classname: {
      type: String,
      default: "",
    },
  },
  setup() {
    return {};
  },
});

export function showDialog<T extends Record<string, unknown>>(
  config: T,
  Component: DefineComponent<any>
) {
  document.body.classList.add("overflow-hidden");

  const cbs = {
    destory: () => {
      document.body.classList.remove("overflow-hidden");
      app.unmount();
      tempDiv.remove();
    },
  };
  const tempDiv = document.createElement("div");
  document.body.appendChild(tempDiv);
  const app = createApp(Component, {
    ...config,
    ...cbs,
  });
  app.use(store).mount(tempDiv);
}

export default Dialog;
</script>
