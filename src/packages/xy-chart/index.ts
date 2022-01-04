import {
  AxisScale,
  curveMonotoneX,
  line,
  scaleLinear,
  scaleTime,
  select,
} from "d3";
import dayjs from "dayjs";
import ToolTip from "./components/ToolTip";
import { drawXAxis, drawYAxis } from "./utils/drawAxis";
import addFilter from "./utils/addFilter";
import addFont from "./utils/addFont";
import { drawTitle, drawXLabel, drawYLabel } from "./utils/drawLabels";
import drawLegend from "./utils/drawLegend";
import getFormatTimeline, {
  getTimestampFormatUnit,
} from "./utils/getFormatTimeline";
import { D3Selection } from "./types";

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
];

const margin = {
  top: 50,
  right: 30,
  bottom: 50,
  left: 50,
};

interface XYPoint {
  x: Date | number;
  y: number;
}

export interface XYData {
  label: string;
  data: XYPoint[];
}

export interface XYChartData {
  datasets: XYData[];
}

export interface XYChartConfig {
  title: string;
  xLabel: string;
  yLabel: string;
  data: XYChartData;
}

export interface XYChartOptions {
  timeFormat?: string;
  isDuration?: boolean;

  xTickCount: number;
  yTickCount: number;
  showLine: boolean;
  dotSize: number;
  dataColors: string[];
  fontFamily: string;
  backgroundColor: string;
  strokeColor: string;
}

const getDefaultOptions = (): XYChartOptions => {
  return {
    showLine: true,
    dotSize: 0.5,
    xTickCount: 5,
    yTickCount: 5,
    dataColors: colors,
    fontFamily: "xkcd",
    strokeColor: "black",
    backgroundColor: "white",
  };
};

const XYChart = (
  svg: SVGSVGElement,
  { title, xLabel, yLabel, data: { datasets } }: XYChartConfig,
  intialOptions: Partial<XYChartOptions>
) => {
  const options: XYChartOptions = {
    ...getDefaultOptions(),
    ...intialOptions,
  };

  if (title) {
    margin.top = 60;
  }
  if (xLabel) {
    margin.bottom = 50;
  }
  if (yLabel) {
    margin.left = 70;
  }

  const data = {
    datasets,
  };

  const filter = "url(#xkcdify)";
  const fontFamily = options.fontFamily || "xkcd";
  const clientWidth = svg.parentElement?.clientWidth || 800;
  const clientHeight = Math.min((clientWidth * 2) / 3, window.innerHeight);

  const d3Selection = select(svg)
    .style("stroke-width", 3)
    .style("font-family", fontFamily)
    .style("background", options.backgroundColor)
    .attr("width", clientWidth)
    .attr("height", clientHeight) as D3Selection;
  d3Selection.selectAll("*").remove();

  const chart = d3Selection
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  addFont(d3Selection);
  addFilter(d3Selection);

  if (title) {
    drawTitle(d3Selection, title, options.strokeColor);
  }
  if (xLabel) {
    drawXLabel(d3Selection, xLabel, options.strokeColor);
  }
  if (yLabel) {
    drawYLabel(d3Selection, yLabel, options.strokeColor);
  }

  const tooltip = new ToolTip({
    selection: d3Selection,
    title: "",
    items: [],
    position: { x: 60, y: 60, type: "up_left" },
    strokeColor: options.strokeColor,
    backgroundColor: options.backgroundColor,
  });

  if (options.timeFormat) {
    data.datasets.forEach((dataset) => {
      dataset.data.forEach((d) => {
        d.x = dayjs(d.x) as any;
      });
    });
  }

  const allData: XYPoint[] = [];
  data.datasets.map((d) => allData.push(...d.data));

  const allXData = allData.map((d) => d.x);
  const allYData = allData.map((d) => d.y);

  const chartWidth = clientWidth - margin.left - margin.right;
  const chartHeight = clientHeight - margin.top - margin.bottom;

  let xScale: AxisScale<number | Date> = scaleLinear()
    .domain([0, Math.max(...allXData.map((d) => Number(d)))])
    .range([0, chartWidth]);

  if (options.timeFormat) {
    xScale = scaleTime()
      .domain([
        Math.min(...allXData.map((d) => Number(d))),
        Math.max(...allXData.map((d) => Number(d))),
      ])
      .range([0, chartWidth]);
  }

  if (options.isDuration) {
    xScale = scaleLinear()
      .domain([0, Math.max(...allXData.map((d) => Number(d)))])
      .range([0, chartWidth]);
  }

  const yScale = scaleLinear()
    .domain([Math.min(...allYData), Math.max(...allYData)])
    .range([chartHeight, 0]);

  const svgChart = chart.append("g").attr("pointer-events", "all");

  // draw axis
  drawXAxis(svgChart, {
    xScale,
    tickCount: options.xTickCount,
    moveDown: chartHeight,
    fontFamily: fontFamily,
    stroke: options.strokeColor,
    isDuration: options.isDuration,
  });
  drawYAxis(svgChart, {
    yScale,
    tickCount: options.yTickCount,
    fontFamily: fontFamily,
    stroke: options.strokeColor,
  });

  // draw lines
  if (options.showLine) {
    const drawLine = line<XYPoint>()
      .x((d) => xScale(d.x) || 0)
      .y((d) => yScale(d.y))
      .curve(curveMonotoneX);

    svgChart
      .selectAll(".xkcd-chart-xyline")
      .data(data.datasets)
      .enter()
      .append("path")
      .attr("class", "xkcd-chart-xyline")
      .attr("d", (d) => drawLine(d.data))
      .attr("fill", "none")
      .attr("stroke", (_, i) => options.dataColors[i])
      .attr("filter", filter);
  }

  // draw dots
  const dotInitSize =
    3.5 * (options.dotSize === undefined ? 1 : options.dotSize);
  const dotHoverSize =
    6 * (options.dotSize === undefined ? 1 : options.dotSize);
  svgChart
    .selectAll(".xkcd-chart-xycircle-group")
    .data(data.datasets)
    .enter()
    .append("g")
    .attr("class", ".xkcd-chart-xycircle-group")
    .attr("filter", filter)
    .attr("xy-group-index", (_, i) => i)
    .selectAll(".xkcd-chart-xycircle-circle")
    .data((dataset) => dataset.data)
    .enter()
    .append("circle")
    .style("stroke", (_, i, nodes) => {
      const xyGroupIndex = Number(
        select(nodes[i].parentElement).attr("xy-group-index")
      );
      return options.dataColors[xyGroupIndex];
    })
    .style("fill", (_, i, nodes) => {
      const xyGroupIndex = Number(
        select(nodes[i].parentElement).attr("xy-group-index")
      );
      return options.dataColors[xyGroupIndex];
    })
    .attr("r", dotInitSize)
    .attr("cx", (d) => xScale(d.x) || 0)
    .attr("cy", (d) => yScale(d.y))
    .attr("pointer-events", "all")
    .on("mouseover", (event, d) => {
      const node = event.target as Element;
      const i = Array.from(node.parentElement?.childNodes || []).indexOf(node);
      const xyGroupIndex = Number(
        select(node.parentElement).attr("xy-group-index")
      );
      select(node).attr("r", dotHoverSize);

      const tipX = (xScale(d.x) || 0) + margin.left + 5;
      const tipY = yScale(d.y) + margin.top + 5;
      let tooltipPositionType = "down_right";
      if (tipX > chartWidth / 2 && tipY < chartHeight / 2) {
        tooltipPositionType = "down_left";
      } else if (tipX > chartWidth / 2 && tipY > chartHeight / 2) {
        tooltipPositionType = "up_left";
      } else if (tipX < chartWidth / 2 && tipY > chartHeight / 2) {
        tooltipPositionType = "up_right";
      }
      let title = `${data.datasets[xyGroupIndex].data[i].x}`;
      if (options.timeFormat) {
        title = dayjs(data.datasets[xyGroupIndex].data[i].x).format(
          options.timeFormat
        );
      }
      if (options.isDuration) {
        const type = getTimestampFormatUnit(
          Number(
            data.datasets[xyGroupIndex].data[1].x ||
              data.datasets[xyGroupIndex].data[i].x
          )
        );
        title = getFormatTimeline(
          Number(data.datasets[xyGroupIndex].data[i].x),
          type
        );
      }

      tooltip.update({
        title,
        items: [
          {
            color: options.dataColors[xyGroupIndex],
            text: `${data.datasets[xyGroupIndex].label || ""}: ${d.y}`,
          },
        ],
        position: {
          x: tipX,
          y: tipY,
          type: tooltipPositionType,
        },
      });
      tooltip.show();
    })
    .on("mouseout", (event) => {
      const node = event.target as Element;
      select(node).attr("r", dotInitSize);
      tooltip.hide();
    });

  // Legend
  const legendItems = data.datasets.map((dataset, i) => ({
    color: options.dataColors[i] || "",
    text: dataset.label,
  }));

  drawLegend(svgChart, {
    items: legendItems,
    strokeColor: options.strokeColor,
    backgroundColor: options.backgroundColor,
  });
};

export default XYChart;
