<template>
  <div
    :class="
      'flex flex-row justify-center items-center select-none ' + classname
    "
  >
    <svg ref="svgEl" @click="handleSVGElementClick"></svg>
  </div>
</template>

<script lang="ts">
import ChartXkcd from "chart.xkcd";
import { defineComponent, onMounted, onUpdated, ref } from "vue";

export default defineComponent({
  name: "StarChart",
  props: {
    classname: {
      type: String,
      default: "",
    },
    data: {
      type: Object as () => RepoStarData[],
    },
  },
  setup(props) {
    const svgEl = ref<SVGSVGElement | null>(null);

    const drawStarChart = (repoStarData: RepoStarData[]) => {
      const datasets: XYData[] = repoStarData.map((item) => {
        const { repo, starRecords } = item;

        return {
          label: repo,
          data: starRecords.map((item) => {
            return {
              x: new Date(item.date),
              y: Number(item.count),
            };
          }),
        };
      });

      if (svgEl.value) {
        svgEl.value.innerHTML = "";
        new ChartXkcd.XY(svgEl.value, {
          title: "Star history",
          yLabel: "GitHub Stars",
          xLabel: "Date",
          data: {
            datasets,
          },
          options: {
            xTickCount: 5,
            yTickCount: 5,
            legendPosition: 1,
            showLine: true,
            timeFormat: "MM/DD/YYYY",
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

    const handleSVGElementClick = (event: MouseEvent) => {
      console.log(event);
    };

    return {
      svgEl,
      handleSVGElementClick,
    };
  },
});
</script>
