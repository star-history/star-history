<template>
  <p>URL: {{ state.url }} {{ state.count }}</p>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from "vue";

interface State {
  url: string;
  count: number;
}

const state = reactive<State>({
  url: "",
  count: 0,
});

onMounted(() => {
  state.count++;
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    const url = tab.url + "";
    state.url = url;
  });
});
</script>
