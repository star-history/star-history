<template>
  <div
    class="flex flex-col justify-center items-center select-none"
    :class="classname"
  >
    <svg ref="svgElRef" @click="handleSVGElementClick"></svg>
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
import XYChart, { XYChartData } from "xy-chart";

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
