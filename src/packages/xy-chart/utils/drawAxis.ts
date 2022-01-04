import { axisBottom, axisLeft, AxisScale } from "d3-axis";
import { D3Selection } from "../types";

interface DrawXAxisConfig {
  xScale: AxisScale<number | Date>;
  tickCount: number;
  moveDown: number;
  fontFamily: string;
  stroke: string;
  tickFormat?: (t: string | number) => string;
}

export const drawXAxis = (
  selection: D3Selection,
  {
    xScale,
    tickCount,
    moveDown,
    fontFamily,
    stroke,
    tickFormat,
  }: DrawXAxisConfig
) => {
  if (tickFormat) {
    const xAxisTickSet = new Set();
    selection
      .append("g")
      .attr("transform", `translate(0,${moveDown})`)
      .call(
        axisBottom(xScale)
          .tickSize(0)
          .tickPadding(6)
          .ticks(tickCount)
          .tickFormat((d) => {
            const tickStr = tickFormat(Number(d));
            // if (xAxisTickSet.has(tickStr)) {
            //   tickStr = '';
            // }
            xAxisTickSet.add(tickStr);
            console.log(d, tickStr);
            return tickStr;
          })
      );
  } else {
    selection
      .append("g")
      .attr("transform", `translate(0,${moveDown})`)
      .call(axisBottom(xScale).tickSize(0).tickPadding(6).ticks(tickCount));
  }

  selection
    .selectAll(".domain")
    .attr("filter", "url(#xkcdify)")
    .style("stroke", stroke);

  selection
    .selectAll(".tick > text")
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
    .call(axisLeft(yScale).tickSize(1).tickPadding(10).ticks(tickCount, "s"));

  selection
    .selectAll(".domain")
    .attr("filter", "url(#xkcdify)")
    .style("stroke", stroke);

  selection
    .selectAll(".tick > text")
    .style("font-family", fontFamily)
    .style("font-size", "16")
    .style("fill", stroke);
};
