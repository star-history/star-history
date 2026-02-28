import http from "http";
import Koa from "koa";
import Router from "koa-router";
import cors from "@koa/cors";
import { optimize, Config } from 'svgo';
import { JSDOM } from "jsdom";
import XYChart from "../shared/packages/xy-chart.js";
import { convertDataToChartData, getRepoData } from "../shared/common/chart.js";
import { ChartMode } from "../shared/types/chart.js";
import logger from "./logger.js";
import cache from "./cache.js";
import {
  getChartWidthWithSize,
  replaceSVGContentFilterWithCamelcase,
  getBase64Image,
} from "./utils.js";
import { getNextToken, initTokenFromEnv } from "./token.js";
import { CHART_SIZES, MAX_REQUEST_AMOUNT } from "./const.js";
import { initOgAssets, renderOgCard } from "./og-card.js";
import { loadRepos } from "../shared/common/repo-data.js";
import fetch from "node-fetch";

const startServer = async () => {
  await initTokenFromEnv();
  initOgAssets();
  const repoStore = loadRepos();

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
    const repos = `${ctx.query["repos"]}`.split(",");

    if (repos.length === 0) {
      ctx.throw(400, `${http.STATUS_CODES[400]}: Repo name required`);
      return;
    }

    // Landscape1 card: returns a 1200×630 SVG with radar chart and attributes
    const style = `${ctx.query["style"]}`;
    if (style === "landscape1") {
      const repo = repos[0];
      const cardData = repoStore.getRepo(repo);
      if (!cardData) {
        ctx.throw(404, `Repo not found in gh dataset: ${repo}`);
        return;
      }
      const token = getNextToken();
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: { Authorization: `token ${token}`, Accept: "application/json" },
        });
        if (!res.ok) {
          ctx.throw(res.status, `GitHub API: ${res.statusText}`);
          return;
        }
        const gh = (await res.json()) as any;
        const avatarBase64 = await getBase64Image(`${gh.owner.avatar_url}&s=200`);
        const svg = await renderOgCard({
          name: gh.full_name,
          description: gh.description,
          stars: gh.stargazers_count,
          forks: gh.forks_count,
          language: gh.language,
          license: gh.license?.spdx_id || null,
          created_at: gh.created_at,
          avatarBase64,
          attributes: cardData.attributes,
          rank: cardData.rank,
        });
        ctx.type = "image/svg+xml;charset=utf-8";
        ctx.set("cache-control", "max-age=86400");
        ctx.body = svg;
      } catch (error: any) {
        const status = error.status || 500;
        ctx.throw(status, `Failed to generate card: ${error.message}`);
      }
      return;
    }

    // --- Star history chart params (only relevant when style is not set) ---
    const theme = `${ctx.query["theme"]}`;
    const transparent = `${ctx.query["transparent"]}`;
    const typeParam = `${ctx.query["type"]}`;
    const timelineParam = ctx.query["timeline"];
    const dateParam = ctx.query["date"];
    const logscaleParam = ctx.query["logscale"];
    const legendParam = `${ctx.query["legend"]}`;
    let type: ChartMode = "Date";
    let size = `${ctx.query["size"]}`;

    if (typeParam && typeParam !== "undefined") {
      const lowerType = typeParam.toLowerCase();
      if (lowerType === "timeline") {
        type = "Timeline";
      } else if (lowerType === "date") {
        type = "Date";
      }
    } else if (timelineParam !== undefined) {
      type = "Timeline";
    } else if (dateParam !== undefined) {
      type = "Date";
    }

    const useLogScale = logscaleParam !== undefined && logscaleParam !== "false";

    let legendPosition: "top-left" | "bottom-right" = "top-left";
    if (legendParam === "bottom-right") {
      legendPosition = "bottom-right";
    }

    if (!CHART_SIZES.includes(size)) {
      size = "laptop";
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
          xLabel: type === "Date" ? "Date" : "Timeline",
          yLabel: "GitHub Stars",
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
