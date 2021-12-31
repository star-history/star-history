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
    timeFormat: String,
    isDuration: Boolean,
  },
  setup(props) {
    const svgElRef = ref<SVGSVGElement | null>(null);

    const drawStarChart = (data: XYChartData) => {
      if (svgElRef.value) {
        svgElRef.value.innerHTML = "";
        new chartXkcd.XY(svgElRef.value, {
          title: "Star history",
          yLabel: "GitHub Stars",
          xLabel: "Date",
          data,
          options: {
            xTickCount: 5,
            yTickCount: 5,
            legendPosition: 1,
            showLine: true,
            timeFormat: props.timeFormat,
            isDuration: props.isDuration,
            dotSize: 0.5,
          },
        });
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
