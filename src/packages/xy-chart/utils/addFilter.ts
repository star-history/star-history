import { D3Selection } from "../types";

const addFilter = (selection: D3Selection) => {
  selection
    .append("filter")
    .attr("id", "xkcdify")
    .attr("filterUnits", "userSpaceOnUse")
    .attr("x", -5)
    .attr("y", -5)
    .attr("width", "100%")
    .attr("height", "100%")
    .call((f) =>
      f
        .append("feTurbulence")
        .attr("type", "fractalNoise")
        .attr("baseFrequency", "0.05")
        .attr("result", "noise")
    )
    .call((f) =>
      f
        .append("feDisplacementMap")
        .attr("scale", "5")
        .attr("xChannelSelector", "R")
        .attr("yChannelSelector", "G")
        .attr("in", "SourceGraphic")
        .attr("in2", "noise")
    );

  selection
    .append("filter")
    .attr("id", "xkcdify-pie")
    .call((f) =>
      f
        .append("feTurbulence")
        .attr("type", "fractalNoise")
        .attr("baseFrequency", "0.05")
        .attr("result", "noise")
    )
    .call((f) =>
      f
        .append("feDisplacementMap")
        .attr("scale", "5")
        .attr("xChannelSelector", "R")
        .attr("yChannelSelector", "G")
        .attr("in", "SourceGraphic")
        .attr("in2", "noise")
    );
};

export default addFilter;
