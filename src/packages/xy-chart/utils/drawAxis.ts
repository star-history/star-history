import { axisBottom, axisLeft, AxisScale } from "d3-axis";
import { D3Selection } from "../types";
import getFormatNumber, {
  getNumberFormatUnit,
  NumberUnitType,
} from "./getFormatNumber";
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
  type: "Date" | "Number";
}

export const drawXAxis = (
  selection: D3Selection,
  { xScale, tickCount, moveDown, fontFamily, stroke, type }: DrawXAxisConfig
) => {
  const xAxisGenerator = axisBottom(xScale)
    .tickSize(0)
    .tickPadding(6)
    .ticks(tickCount);

  if (type === "Number") {
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
    .style("font-size", "16px")
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
  let type: NumberUnitType | undefined = undefined;
  const yAxisGenerator = axisLeft(yScale)
    .tickSize(1)
    .tickPadding(6)
    .ticks(tickCount, "s")
    .tickFormat((d) => {
      if (d === 0) {
        return " ";
      }
      if (!type) {
        type = getNumberFormatUnit(d);
      }

      return getFormatNumber(d, type);
    });

  selection.append("g").attr("class", "yaxis").call(yAxisGenerator);

  selection
    .selectAll(".domain")
    .attr("filter", "url(#xkcdify)")
    .style("stroke", stroke);

  selection
    .selectAll(".yaxis > .tick > text")
    .style("font-family", fontFamily)
    .style("font-size", "16px")
    .style("fill", stroke);
};
