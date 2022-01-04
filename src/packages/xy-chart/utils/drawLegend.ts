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
  const legend = selection.append("svg");
  const backgroundLayer = legend.append("svg");
  const textLayer = legend.append("svg");

  items.forEach((item, i) => {
    textLayer
      .append("rect")
      .style("fill", item.color)
      .attr("width", 8)
      .attr("height", 8)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("filter", "url(#xkcdify)")
      .attr("x", 15)
      .attr("y", 17 + 20 * i);

    textLayer
      .append("text")
      .style("font-size", "15")
      .style("fill", strokeColor)
      .attr("x", 15 + 12)
      .attr("y", 17 + 20 * i + 8)
      .text(item.text);
  });

  const bbox = textLayer.node()?.getBBox();

  if (!bbox) {
    console.error("bbox get null in drawLegend");
    return;
  }

  const backgroundWidth = bbox.width + 15;
  const backgroundHeight = bbox.height + 10;

  const legendX = 0;
  const legendY = 0;

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

  // get legend
  legend.attr("x", legendX).attr("y", legendY);
};

export default drawLegend;
