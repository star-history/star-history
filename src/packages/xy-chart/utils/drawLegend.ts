import { D3Selection } from "../types";

interface DrawLegendConfig {
  items: {
    color: string;
    text: string;
  }[];
  strokeColor: string;
  backgroundColor: string;
}

const drawLegend = (
  selection: D3Selection,
  { items, strokeColor, backgroundColor }: DrawLegendConfig
) => {
  const legendPadding = 10;
  const xkcdCharWidth = 7;
  const xkcdCharHeight = 20;
  const colorBlockWidth = 15;

  const legend = selection.append("svg");
  const backgroundLayer = legend.append("svg");
  const textLayer = legend.append("svg");
  let maxTextLength = 0;

  items.forEach((item, i) => {
    // draw color dot
    textLayer
      .append("rect")
      .style("fill", item.color)
      .attr("width", 8)
      .attr("height", 8)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("filter", "url(#xkcdify)")
      .attr("x", 5 + legendPadding)
      .attr("y", 17 + xkcdCharHeight * i);
    // draw text
    textLayer
      .append("text")
      .style("font-size", "15px")
      .style("fill", strokeColor)
      .attr("x", colorBlockWidth + 12)
      .attr("y", 17 + xkcdCharHeight * i + 8)
      .text(item.text);

    maxTextLength = Math.max(item.text.length, maxTextLength);
  });

  const backgroundWidth =
    maxTextLength * xkcdCharWidth + colorBlockWidth + legendPadding;
  const backgroundHeight = items.length * xkcdCharHeight + legendPadding;

  // add background
  backgroundLayer
    .append("rect")
    .style("fill", backgroundColor)
    .attr("fill-opacity", 0.85)
    .attr("stroke", strokeColor)
    .attr("stroke-width", 2)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("filter", "url(#xkcdify)")
    .attr("width", backgroundWidth)
    .attr("height", backgroundHeight)
    .attr("x", 8)
    .attr("y", 5);
};

export default drawLegend;
