<template>
  <div
    class="w-full h-auto min-h-400px flex flex-col justify-start items-start overflow-x-auto select-none"
    :class="classname"
  >
    <svg
      ref="svgElRef"
      class="w-full min-w-600px min-h-400px"
      @click="handleSVGElementClick"
    ></svg>
    <!-- watermark -->
    <div
      class="w-full min-w-600px h-8 -mt-6 pr-2 flex flex-row justify-end items-center text-gray-500"
      style="font-family: 'xkcd', serif"
    >
      <img class="w-5 h-auto mr-1" src="/icon.png" />
      star-history.com
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUpdated, ref } from "vue";
// For customizing multi mode chart: base on create date or timeline, we have rewrited the chart.xkcd's XY chart with TypeScript.
// Here are some reasons about this motivation.
//
// The shortcomings of the old chart.xkcd (project link: https://github.com/timqian/chart.xkcd):
// 1. The X axis label string could be only formatted date or raw text;
// 2. It's difficult/not possible to debug and customize;
//
// The advantages of the new one:
// 1. Writing in native TypeScript;
// 2. Easy to debug chart internal;
// 3. Totally customizable.
import XYChart, { XYChartData } from "../../../packages/xy-chart";

const props = defineProps({
  classname: {
    type: String,
    default: "",
  },
  data: {
    type: Object as () => XYChartData,
  },
  chartMode: {
    type: String,
    default: "Date",
  },
  timeFormat: String,
});

const svgElRef = ref<SVGSVGElement | null>(null);

const drawStarChart = (data: XYChartData) => {
  if (svgElRef.value) {
    svgElRef.value.innerHTML = "";

    XYChart(
      svgElRef.value,
      {
        title: "Star history",
        xLabel: props.chartMode === "Timeline" ? "Timeline" : "Date",
        yLabel: "GitHub Stars",
        data: {
          datasets: data.datasets,
        },
        showDots: true,
      },
      {
        xTickLabelType: props.chartMode === "Date" ? "Date" : "Number",
      }
    );
  }
};

onMounted(() => {
  if (props.data) {
    drawStarChart(props.data);
  }
});

onUpdated(() => {
  if (props.data) {
    drawStarChart(props.data);
  }
});

const handleSVGElementClick = () => {
  // Maybe we can capture the clicked svg element to expand chart functions.
};
</script>
