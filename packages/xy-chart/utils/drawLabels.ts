import { D3Selection } from "../types";

export const drawTitle = (
  selection: D3Selection,
  text: string,
  color: string
) => {
  selection
    .append("text")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .style("fill", color)
    .attr("x", "50%")
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .text(text);
};

export const drawXLabel = (
  selection: D3Selection,
  text: string,
  color: string
) => {
  selection
    .append("text")
    .style("font-size", "17px")
    .style("fill", color)
    .attr("x", "50%")
    .attr("y", ((selection.attr("height") as unknown as number) || 10) - 10)
    .attr("text-anchor", "middle")
    .text(text);
};

export const drawYLabel = (
  selection: D3Selection,
  text: string,
  color: string,
  offsetY = 6
) => {
  selection
    .append("text")
    .attr("text-anchor", "end")
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .style("font-size", "17px")
    .style("fill", color)
    .text(text)
    .attr("y", offsetY)
    .call((f) => {
      const defaultTextLength = 24;
      let textLength = defaultTextLength;
      // Because there is no `getComputedTextLength` method in nodejs env,
      // we have to use it after validate function existed.
      if (f.node()?.getComputedTextLength) {
        textLength = f.node()?.getComputedTextLength() as number;
      }
      f.attr(
        "x",
        0 -
          ((selection.attr("height") as unknown as number) || 10) / 2 +
          textLength / 2
      );
    });
};
