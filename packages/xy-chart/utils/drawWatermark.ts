import { D3Selection } from "../types";

export const drawWatermark = (
  selection: D3Selection,
  chartWidth: number,
  chartHeight: number
) => {
  selection
    .append("text")
    .style("font-size", "16px")
    .style("fill", "#666666")
    .attr("transform", `translate(${chartWidth - 50},${chartHeight + 40})`)
    .attr("text-anchor", "middle")
    .text("star-history.com");

  selection
    .append("image")
    .attr("transform", `translate(${chartWidth - 135},${chartHeight + 24})`)
    .attr("height", 20)
    .attr("width", 20)
    .attr("href", "/icon.png");
};
