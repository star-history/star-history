import { D3Selection } from "../types";

export const drawTitle = (
  seletion: D3Selection,
  text: string,
  color: string
) => {
  seletion
    .append("text")
    .style("font-size", "20")
    .style("font-weight", "bold")
    .style("fill", color)
    .attr("x", "50%")
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .text(text);
};

export const drawXLabel = (
  seletion: D3Selection,
  text: string,
  color: string
) => {
  seletion
    .append("text")
    .style("font-size", 17)
    .style("fill", color)
    .attr("x", "50%")
    .attr("y", ((seletion.attr("height") as unknown as number) || 10) - 10)
    .attr("text-anchor", "middle")
    .text(text);
};

export const drawYLabel = (
  seletion: D3Selection,
  text: string,
  color: string,
  offsetY = 6
) => {
  seletion
    .append("text")
    .attr("text-anchor", "end")
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .style("font-size", 17)
    .style("fill", color)
    .text(text)
    .attr("y", offsetY)
    .call((f) => {
      const textLength = f.node()?.getComputedTextLength() || 24;
      f.attr(
        "x",
        0 -
          ((seletion.attr("height") as unknown as number) || 10) / 2 +
          textLength / 2
      );
    });
};
