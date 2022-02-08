import Koa from "koa";
import Router from "koa-router";
import { JSDOM } from "jsdom";
import XYChart from "../packages/xy-chart";
import {
  convertStarDataToChartData,
  getReposStarData,
} from "../src/helpers/chart";

const replaceSVGContentFilterWithCamelcase = (svgContent: string): string => {
  return svgContent.replace(
    /<filter (.*?)>(.*?)<\/filter>/g,
    `<filter xmlns="http://www.w3.org/2000/svg" id="xkcdify" filterUnits="userSpaceOnUse" x="-5" y="-5" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.05" result="noise"/><feDisplacementMap scale="5" xChannelSelector="R" yChannelSelector="G" in="SourceGraphic" in2="noise"/></filter>`
  );
};

const app = new Koa();
const router = new Router();

// Example request link:
// /?secret=Z2hwXzlNNXNhbXJGU29nWE5uRW15NXQ2MFo1dVRGdXZnaDBOV0Q4Rg==&repos=bytebase/bytebase&type=Date
router.get("/", async (ctx) => {
  const secretToken = `${ctx.query["secret"]}`;
  const repos = `${ctx.query["repos"]}`.split(",");
  const type = `${ctx.query["type"]}`;

  const token = Buffer.from(secretToken, "base64").toString();
  if (token === "") {
    // do nth
  }

  const repoStarData = await getReposStarData(repos, token);
  const chartData = convertStarDataToChartData(
    repoStarData,
    type as "Date" | "Timeline"
  );

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
      xLabel: type === "Timeline" ? "Timeline" : "Date",
      yLabel: "GitHub Stars",
      data: chartData,
      showDots: false,
    },
    {
      xTickLabelType: type === "Date" ? "Date" : "Number",
    }
  );
  const svgContent = replaceSVGContentFilterWithCamelcase(svg.outerHTML);
  svg.remove();

  ctx.type = "image/svg+xml;charset=utf-8";
  ctx.body = svgContent;
});

app.on("error", (err) => {
  console.error("server error", err);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, () => {
  console.log(`app listening on port ${8080}!`);
});
