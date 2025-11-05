import http from "http";
import Koa from "koa";
import Router from "koa-router";
import cors from "@koa/cors";
import { optimize, Config } from 'svgo';
import { JSDOM } from "jsdom";
import XYChart from "./shared/packages/xy-chart.js";
import { convertDataToChartData, getRepoData } from "./shared/common/chart.js";
import { ChartMode } from "./shared/types/chart.js";
import logger from "./logger.js";
import cache from "./cache.js";
import {
  getChartWidthWithSize,
  replaceSVGContentFilterWithCamelcase,
  getBase64Image,
} from "./utils.js";
import { getNextToken, initTokenFromEnv } from "./token.js";
import { CHART_SIZES, CHART_TYPES, MAX_REQUEST_AMOUNT } from "./const.js";

const startServer = async () => {
  await initTokenFromEnv();

  const app = new Koa();
  app.use(cors());
  const router = new Router();

  // Health check endpoint
  router.get("/healthz", async (ctx) => {
    ctx.status = 200;
    ctx.body = "OK";
  });

  // Example request link:
  // /svg?repos=star-history/star-history&type=timeline&logscale&legend=bottom-right
  router.get("/svg", async (ctx) => {
    const theme = `${ctx.query["theme"]}`;
    const transparent = `${ctx.query["transparent"]}`
    const repos = `${ctx.query["repos"]}`.split(",");
    const typeParam = `${ctx.query["type"]}`;
    const timelineParam = ctx.query["timeline"];
    const dateParam = ctx.query["date"];
    const logscaleParam = ctx.query["logscale"];
    const legendParam = `${ctx.query["legend"]}`;
    let type: ChartMode = "Date";
    let size = `${ctx.query["size"]}`;

    // Parse chart type - support both type=timeline/date (preferred) and naked timeline/date (backward compatibility)
    if (typeParam && typeParam !== "undefined") {
      const lowerType = typeParam.toLowerCase();
      if (lowerType === "timeline") {
        type = "Timeline";
      } else if (lowerType === "date") {
        type = "Date";
      }
    } else if (timelineParam !== undefined) {
      // Backward compatibility: naked timeline parameter
      type = "Timeline";
    } else if (dateParam !== undefined) {
      // Backward compatibility: naked date parameter
      type = "Date";
    }

    // Parse logscale parameter - presence of parameter means enabled
    const useLogScale = logscaleParam !== undefined && logscaleParam !== "false";

    // Parse legend position parameter
    let legendPosition: "top-left" | "bottom-right" = "top-left";
    if (legendParam === "bottom-right") {
      legendPosition = "bottom-right";
    }

    if (!CHART_SIZES.includes(size)) {
      size = "laptop";
    }

    if (repos.length === 0) {
      ctx.throw(400, `${http.STATUS_CODES[400]}: Repo name required`);
      return;
    }

    const repoData = [];
    const nodataRepos = [];

    for (const repo of repos) {
      const cacheData = cache.get(repo);

      if (cacheData) {
        repoData.push({
          repo,
          starRecords: cacheData.starRecords,
          logoUrl: cacheData.logoUrl,
        });
      } else {
        nodataRepos.push(repo);
      }
    }

    if (nodataRepos.length > 0) {
      const token = getNextToken();

      try {
        const data = await getRepoData(nodataRepos, token, MAX_REQUEST_AMOUNT);

        for (const d of data) {
          d.logoUrl = await getBase64Image(`${d.logoUrl}&size=22`);
          cache.set(d.repo, {
            starRecords: d.starRecords,
            starAmount: d.starRecords[d.starRecords.length - 1].count,
            logoUrl: d.logoUrl,
          });
          repoData.push(d);
        }
      } catch (error: any) {
        const status = error.status || 400;
        const message =
          error.message || "Some unexpected error happened, try again later";

        ctx.status = status;
        ctx.message = `${http.STATUS_CODES[status]}: ${message}`;
        return;
      }
    }

    const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
    const body = dom.window.document.querySelector("body");
    const svg = dom.window.document.createElement(
      "svg"
    ) as unknown as SVGSVGElement;

    if (!dom || !body || !svg) {
      ctx.throw(
        500,
        `${http.STATUS_CODES[500]}: Failed to mock dom with JSDOM`
      );
      return;
    }

    body.append(svg);
    svg.setAttribute("width", `${getChartWidthWithSize(size)}`);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    try {
      XYChart(
        svg,
        {
          title: "Star History",
          data: convertDataToChartData(repoData, type),
          showDots: false,
          transparent: transparent.toLowerCase() === "true",
          theme: theme === "dark" ? "dark" : "light",
        },
        {
          xTickLabelType: type === "Date" ? "Date" : "Number",
          chartWidth: getChartWidthWithSize(size),
          useLogScale: useLogScale,
          legendPosition: legendPosition,
        }
      );
    } catch (error) {
      ctx.throw(
        500,
        `${http.STATUS_CODES[500]}: Failed to generate chart, ${error}`
      );
      return;
    }

    // Optimizing SVG to save bandwidth
    const svgContent = replaceSVGContentFilterWithCamelcase(svg.outerHTML);
    const options: Config = {
      multipass: true, // Apply optimizations multiple times
    };
    const optimized = optimize(svgContent, options).data;

    ctx.type = "image/svg+xml;charset=utf-8";
    // Consistent with the ttl in cache.ts
    ctx.set("cache-control", "max-age=86400");
    ctx.body = optimized;
  });

  app.on("error", (err) => {
    logger.error("server error: ", err);
  });

  app.use(router.routes()).use(router.allowedMethods());

  app.listen(8080, () => {
    logger.info(`server running on port ${8080}`);
  });
};

startServer();
