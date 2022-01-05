<template>
  <div
    class="flex flex-col justify-center items-center select-none"
    :class="classname"
  >
    <svg ref="svgElRef" @click="handleSVGElementClick"></svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated, ref } from "vue";
// NOTE: For customizing multi mode chart: base on create date or timeline, we have rewrited the chart.xkcd's XY chart with TypeScript.
// refer to chart.xkcd: https://github.com/timqian/chart.xkcd
import XYChart, { XYChartData } from "../../packages/xy-chart";

export default defineComponent({
  name: "StarXYChart",
  props: {
    classname: {
      type: String,
      default: "",
    },
    data: {
      type: Object as () => XYChartData,
    },
    chartMode: String,
    timeFormat: String,
    isDuration: Boolean,
  },
  setup(props) {
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
          },
          {
            timeFormat: props.timeFormat,
            isDuration: props.isDuration,
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

    return {
      svgElRef,
      handleSVGElementClick,
    };
  },
});
</script>
