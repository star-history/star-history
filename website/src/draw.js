import chartXkcd from "chart.xkcd";

// Default xkcd chart color list + https://github.com/mrmrs/colors
const colors = [
  "#dd4528",
  "#28a3dd",
  "#f3db52",
  "#ed84b5",
  "#4ab74e",
  "#9179c0",
  "#8e6d5a",
  "#f19839",
  "#949494",
  "#001f3f",
  "#0074d9",
  "#7fdbff",
  "#39cccc",
  "#3d9970",
  "#2ecc40",
  "#01ff70",
  "#ffdc00",
  "#ff851b",
  "#ff4136",
  "#f012be",
  "#b10dc9",
  "#85144b",
  "#aaaaaa",
  "#dddddd",
];

/**
 * draw star history graph based on data
 * @param {String} datasets example [{label:'tj/koa', data:[{x:'2016-6-12', y:12}, ...]}, ...]
 */
export default function draw(datasets) {
  const svg = document.querySelector("#chart svg");
  new chartXkcd.XY(svg, {
    title: "Star history",
    yLabel: "Github stars",
    xLabel: "Date",
    data: {
      datasets,
    },
    options: {
      xTickCount: 5,
      yTickCount: 5,
      legendPosition: chartXkcd.config.positionType.upLeft,
      showLine: true,
      timeFormat: "MM/DD/YYYY",
      dotSize: 0.5,
      dataColors: colors,
    },
  });
}
