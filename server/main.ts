import { JSDOM } from "jsdom";
import api from "./api";
import XYChart from "../packages/xy-chart";
import fs from "fs";

api.getRepoStarRecords("justmemos/memos").then((data) => {
  console.log(data);
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
  const body = dom.window.document.querySelector("body");
  const svg = dom.window.document.createElement("svg");
  body.append(svg);
  svg.setAttribute("width", "600");
  svg.setAttribute("height", "400");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  XYChart(
    svg as any,
    {
      title: "Star history",
      xLabel: "Date",
      yLabel: "GitHub Stars",
      data: {
        datasets: [
          {
            label: "test",
            data: data.map((item) => {
              return {
                x: new Date(item.date),
                y: Number(item.count),
              };
            }),
          },
        ],
      },
      showDots: true,
    },
    {
      xTickLabelType: "Date",
    }
  );

  fs.writeFileSync("out.svg", svg.outerHTML);
});
