import Koa from "koa";
import Router from "koa-router";
import { JSDOM } from "jsdom";
import XYChart from "../packages/xy-chart";
import { convertStarDataToChartData, getReposStarData } from "../common/chart";
import api from "../common/api";
import { repoStarDataCache } from "./cache";
import { replaceSVGContentFilterWithCamelcase } from "./utils";
import { getNextToken, initTokenFromEnv } from "./token";

initTokenFromEnv();

const app = new Koa();
const router = new Router();

// Example request link:
// /svg?secret=Z2hwXzlNNXNhbXJGU29nWE5uRW15NXQ2MFo1dVRGdXZnaDBOV0Q4Rg==&repos=bytebase/bytebase&type=Date
router.get("/svg", async (ctx) => {
  const repos = `${ctx.query["repos"]}`.split(",");
  let type = `${ctx.query["type"]}`;

  if (!["Date", "Timeline"].includes(type)) {
    type = "Date";
  }

  if (repos.length === 0) {
    ctx.throw(400, "Repos required");
    return;
  }

  const token = getNextToken();
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
  } catch (error: any) {
    const status = error.status || 400;
    const message =
      error.message || "Some unexpected error happened, try again later";

    ctx.throw(status, message);
    return;
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

  if (!dom || !body || !svg) {
    ctx.throw(500, `Failed to mock dom with JSDOM`);
    return;
  }

  body.append(svg);
  svg.setAttribute("width", "600");
  svg.setAttribute("height", "400");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  try {
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
  } catch (error) {
    ctx.throw(500, `Failed to generate chart, err: ${error}`);
    return;
  }

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
