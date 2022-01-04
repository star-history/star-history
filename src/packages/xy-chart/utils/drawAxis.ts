import { axisBottom, axisLeft, AxisScale } from "d3-axis";
import { D3Selection } from "../types";
import getFormatTimeline, {
  DurationUnitType,
  getTimestampFormatUnit,
} from "./getFormatTimeline";

interface DrawXAxisConfig {
  xScale: AxisScale<number | Date>;
  tickCount: number;
  moveDown: number;
  fontFamily: string;
  stroke: string;
  isDuration?: boolean;
}

export const drawXAxis = (
  selection: D3Selection,
  {
    xScale,
    tickCount,
    moveDown,
    fontFamily,
    stroke,
    isDuration,
  }: DrawXAxisConfig
) => {
  const xAxisGenerator = axisBottom(xScale)
    .tickSize(0)
    .tickPadding(6)
    .ticks(tickCount);

  if (isDuration) {
    let index = 1;
    let type: DurationUnitType | undefined = undefined;
    xAxisGenerator.tickFormat((d) => {
      const timestamp = Number(d);
      const tickAmount = selection.selectAll(".xaxis > .tick").nodes().length;
      index++;
      if (timestamp === 0 || (tickAmount >= 7 && index % 2 === 0)) {
        return " ";
      }
      if (!type) {
        type = getTimestampFormatUnit(timestamp);
      }

      return getFormatTimeline(timestamp, type);
    });
  }

  selection
    .append("g")
    .attr("class", "xaxis")
    .attr("transform", `translate(0,${moveDown})`)
    .call(xAxisGenerator);

  selection
    .selectAll(".domain")
    .attr("filter", "url(#xkcdify)")
    .style("stroke", stroke);

  selection
    .selectAll(".xaxis > .tick > text")
    .style("font-family", fontFamily)
    .style("font-size", "16")
    .style("fill", stroke);
};

interface DrawYAxisConfig {
  yScale: AxisScale<number>;
  tickCount: number;
  fontFamily: string;
  stroke: string;
}

export const drawYAxis = (
  selection: D3Selection,
  { yScale, tickCount, fontFamily, stroke }: DrawYAxisConfig
) => {
  selection
    .append("g")
    .attr("class", "yaxis")
    .call(axisLeft(yScale).tickSize(1).tickPadding(10).ticks(tickCount, "s"));

  selection
    .selectAll(".domain")
    .attr("filter", "url(#xkcdify)")
    .style("stroke", stroke);

  selection
    .selectAll(".yaxis > .tick > text")
    .style("font-family", fontFamily)
    .style("font-size", "16")
    .style("fill", stroke);
};
