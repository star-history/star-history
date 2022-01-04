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
import getDurationFormatString from "./utils/getDurationFormatString";
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
  const svgClientWidth = svg.parentElement?.clientWidth || 0;

  const d3Selection = select(svg)
    .style("stroke-width", 3)
    .style("font-family", fontFamily)
    .style("background", options.backgroundColor)
    .attr("width", svgClientWidth)
    .attr(
      "height",
      Math.min((svgClientWidth * 2) / 3, window.innerHeight)
    ) as D3Selection;
  d3Selection.selectAll("*").remove();

  const chart = d3Selection
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const width =
    (d3Selection.attr("width") as unknown as number) -
    margin.left -
    margin.right;
  const height =
    (d3Selection.attr("height") as unknown as number) -
    margin.top -
    margin.bottom;
  addFont(d3Selection);
  addFilter(d3Selection);

  const render = () => {
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
      items: [
        { color: "red", text: "weweyang" },
        { color: "blue", text: "timqian" },
      ],
      position: { x: 60, y: 60, type: "down_right" },
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

    const allDataX = allData.map((d) => d.x);
    const allDataY = allData.map((d) => d.y);

    let xScale: AxisScale<number | Date> = scaleLinear()
      .domain([0, Math.max(...allDataX.map((d) => Number(d)))])
      .range([0, width]);

    if (options.timeFormat) {
      xScale = scaleTime()
        .domain([
          Math.min(...allDataX.map((d) => Number(d))),
          Math.max(...allDataX.map((d) => Number(d))),
        ])
        .range([0, width]);
    }

    if (options.isDuration) {
      xScale = scaleLinear()
        .domain([0, Math.max(...allDataX.map((d) => Number(d)))])
        .range([0, width]);
    }

    const yScale = scaleLinear()
      .domain([Math.min(...allDataY), Math.max(...allDataY)])
      .range([height, 0]);

    const graphPart = chart.append("g").attr("pointer-events", "all");

    // axis
    drawXAxis(graphPart, {
      xScale,
      tickCount: options.xTickCount === undefined ? 5 : options.xTickCount,
      moveDown: height,
      fontFamily: fontFamily,
      stroke: options.strokeColor,
      tickFormat: options.isDuration
        ? (d) => (d <= 0 ? " " : getDurationFormatString(Number(d)))
        : undefined,
    });
    drawYAxis(graphPart, {
      yScale,
      tickCount: options.yTickCount === undefined ? 5 : options.yTickCount,
      fontFamily: fontFamily,
      stroke: options.strokeColor,
    });

    // lines
    if (options.showLine) {
      const drawLine = line<XYPoint>()
        .x((d) => xScale(d.x) || 0)
        .y((d) => yScale(d.y))
        .curve(curveMonotoneX);

      graphPart
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

    // dots
    const dotInitSize =
      3.5 * (options.dotSize === undefined ? 1 : options.dotSize);
    const dotHoverSize =
      6 * (options.dotSize === undefined ? 1 : options.dotSize);
    graphPart
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
        // FIXME: here I want to pass xyGroupIndex down to the circles by reading parent attrs
        // It might have perfomance issue with a large dataset, not sure there are better ways
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
        const i = Array.from(node.parentElement?.childNodes || []).indexOf(
          node
        );
        const xyGroupIndex = Number(
          select(node.parentElement).attr("xy-group-index")
        );
        select(node).attr("r", dotHoverSize);

        const tipX = (xScale(d.x) || 0) + margin.left + 5;
        const tipY = yScale(d.y) + margin.top + 5;
        let tooltipPositionType = "down_right";
        if (tipX > width / 2 && tipY < height / 2) {
          tooltipPositionType = "down_left";
        } else if (tipX > width / 2 && tipY > height / 2) {
          tooltipPositionType = "up_left";
        } else if (tipX < width / 2 && tipY > height / 2) {
          tooltipPositionType = "up_right";
        }
        let title = `${data.datasets[xyGroupIndex].data[i].x}`;
        if (options.timeFormat) {
          title = dayjs(data.datasets[xyGroupIndex].data[i].x).format(
            options.timeFormat
          );
        }
        if (options.isDuration) {
          title = getDurationFormatString(
            Number(data.datasets[xyGroupIndex].data[i].x)
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

    drawLegend(graphPart, {
      items: legendItems,
      strokeColor: options.strokeColor,
      backgroundColor: options.backgroundColor,
    });
  };

  render();
};

export default XYChart;
