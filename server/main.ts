import Koa from "koa";
import Router from "koa-router";
import { JSDOM } from "jsdom";
import XYChart from "../packages/xy-chart";
import {
  convertStarDataToChartData,
  getReposStarData,
} from "../src/helpers/chart";
import api from "../src/helpers/api";
import { repoStarDataCache } from "./cache";

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

  const reposStarData = [];
  const nodataRepos = [];

  for (const repo of repos) {
    const cacheData = repoStarDataCache.get(repo);

    if (cacheData) {
      try {
        const starAmount = await api.getRepoStargazersCount(repo, token);

        if (starAmount === cacheData.starAmount) {
          reposStarData.push({
            repo,
            starRecords: cacheData.starRecords,
          });
        } else {
          nodataRepos.push(repo);
        }
      } catch (error) {
        nodataRepos.push(repo);
      }
    } else {
      nodataRepos.push(repo);
    }
  }

  try {
    const data = await getReposStarData(nodataRepos, token);
    for (const d of data) {
      repoStarDataCache.set(d.repo, {
        starRecords: d.starRecords,
        starAmount: d.starRecords[d.starRecords.length - 1].count,
      });
      reposStarData.push(d);
    }
  } catch (error) {
    // todo
  }

  const chartData = convertStarDataToChartData(
    reposStarData,
    type as "Date" | "Timeline"
  );

  const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
  const body = dom.window.document.querySelector("body");
  const svg = dom.window.document.createElement(
    "svg"
  ) as unknown as SVGSVGElement;
  body.append(svg);
  svg.setAttribute("width", "600");
  svg.setAttribute("height", "400");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  XYChart(
    svg,
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

  ctx.type = "image/svg+xml;charset=utf-8";
  ctx.set("cache-control", "public, max-age=86400");
  ctx.set("date", `${new Date()}`);
  ctx.set("expires", `${new Date()}`);
  ctx.body = svgContent;
});

app.on("error", (err) => {
  console.error("server error", err);
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, () => {
  console.log(`app listening on port ${8080}!`);
});
