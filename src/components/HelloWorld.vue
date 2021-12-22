<template>
  <h1 class="text-3xl font-bold underline">{{ msg }}</h1>
  <button type="button" @click="state.count++">
    count is: {{ state.count }}
  </button>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

interface State {
  count: number;
}

export default defineComponent({
  name: "HelloWorld",
  props: {
    msg: {
      type: String,
      default: "",
    },
  },
  setup() {
    const state = reactive<State>({
      count: 0,
    });

    return {
      state,
    };
  },
});
</script>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
