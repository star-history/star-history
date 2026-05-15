import { Hono } from "hono";
import { cors } from "hono/cors";
import { compress } from "hono/compress";
import { serve } from "@hono/node-server";
import { optimize } from 'svgo';
import { JSDOM } from "jsdom";
import XYChart from "../shared/packages/xy-chart.js";
import { convertDataToChartData, getRepoData, isValidIsoDateString } from "../shared/common/chart.js";
import { ChartMode } from "../shared/types/chart.js";
import logger from "./logger.js";
import cache, { ogCardCache, svgCache, recordCacheHit, recordCacheMiss, getAllCacheStats } from "./cache.js";
import {
  getChartWidthWithSize,
  fixJsdomSvgCasing,
  getBase64Image,
} from "./utils.js";
import { getNextToken, markTokenExhausted, initTokenFromEnv } from "./token.js";
import { CHART_SIZES, MAX_REQUEST_AMOUNT, MAX_REPOS_PER_REQUEST } from "./const.js";
import { initOgAssets, renderOgCard } from "./og-card.js";
import { loadRepos } from "../shared/common/repo-data.js";

const SVG_HEADERS = {
  "Content-Type": "image/svg+xml;charset=utf-8",
  "Cache-Control": "public, s-maxage=86400, max-age=86400",
} as const;

const startServer = async () => {
  await initTokenFromEnv();
  initOgAssets();
  const repoStore = loadRepos();

  const app = new Hono();
  app.use(cors());
  app.use(compress());

  // Request logging middleware
  app.use(async (c, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    logger.info(`${c.req.method} ${c.req.path} ${c.res.status} ${ms}ms`);
  });

  app.onError((err, c) => {
    logger.error(`server error: ${err.stack || err}`);
    return c.text("Internal Server Error", 500);
  });

  // Health check endpoint with cache stats
  app.get("/healthz", (c) => {
    return c.json({
      status: "OK",
      commit: process.env.GIT_COMMIT || "unknown",
      cache: getAllCacheStats(),
    }, 200);
  });

  // Normalize /svg query params for CDN cache efficiency.
  // Redirects to the canonical URL so Cloudflare caches one entry per unique chart.
  app.get("/svg", async (c, next) => {
    const url = new URL(c.req.url);
    const params = url.searchParams;
    const repos = params.get("repos");
    if (!repos) {
      return await next();
    }

    // Lowercase repo names (GitHub is case-insensitive)
    const normalized = repos.split(",").map((r) => r.trim().toLowerCase()).filter(Boolean).join(",");
    if (normalized !== repos) {
      params.set("repos", normalized);
      return c.redirect(`${url.pathname}?${params.toString()}`, 301);
    }

    return await next();
  });

  // Example request link:
  // /svg?repos=star-history/star-history&type=timeline&logscale&legend=bottom-right
  app.get("/svg", async (c) => {
    const reposParam = c.req.query("repos");
    if (!reposParam) {
      return c.text("Repo name required", 400);
    }
    const repos = reposParam.split(",").filter(Boolean);
    if (repos.length > MAX_REPOS_PER_REQUEST) {
      return c.text(`Too many repos: max ${MAX_REPOS_PER_REQUEST} per request`, 400);
    }

    // Landscape1 card: returns a 1200x630 SVG with radar chart and attributes
    const style = c.req.query("style") ?? "";
    if (style === "landscape1") {
      const repo = repos[0];
      const cardData = repoStore.getRepo(repo);
      if (!cardData) {
        return c.text(`Repo not found in gh dataset: ${repo}`, 404);
      }

      const cachedCard = ogCardCache.get(repo);
      if (cachedCard) {
        recordCacheHit("ogCard");
        return c.body(cachedCard, 200, SVG_HEADERS);
      }
      recordCacheMiss("ogCard");

      const token = getNextToken();
      if (!token) {
        return c.text("All GitHub API tokens are rate-limited, try again later", 503);
      }
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: { Authorization: `token ${token}`, Accept: "application/json" },
          signal: AbortSignal.timeout(15000),
        });
        if (res.status === 403) {
          markTokenExhausted(token);
        }
        if (!res.ok) {
          return c.text(`GitHub API: ${res.statusText}`, res.status as any);
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
        ogCardCache.set(repo, svg);
        return c.body(svg, 200, SVG_HEADERS);
      } catch (error: any) {
        const status = error.status || 500;
        return c.text(`Failed to generate card: ${error.message}`, status);
      }
    }

    // --- Star history chart params (only relevant when style is not set) ---
    const theme = c.req.query("theme") ?? "";
    const transparent = c.req.query("transparent") ?? "";
    const typeParam = c.req.query("type") ?? "";
    const logscaleParam = c.req.query("logscale");
    const legendParam = c.req.query("legend") ?? "";
    const fromParam = c.req.query("from") ?? "";
    let type: ChartMode = "Date";
    let size = c.req.query("size") ?? "";

    // #527: Date-from validation
    let startDate: string | null = null;
    if (fromParam) {
      if (isValidIsoDateString(fromParam)) {
        startDate = fromParam;
      } else {
        return c.text("Invalid 'from' parameter: expected a real calendar date in YYYY-MM-DD form", 400);
      }
    }

    if (typeParam) {
      const lowerType = typeParam.toLowerCase();
      if (lowerType === "timeline") {
        type = "Timeline";
      } else if (lowerType === "date") {
        type = "Date";
      }
    } else if (c.req.query("timeline") !== undefined) {
      type = "Timeline";
    } else if (c.req.query("date") !== undefined) {
      type = "Date";
    }

    const useLogScale = logscaleParam !== undefined && logscaleParam !== "false";

    // #529: Extended legend positioning (5 values: auto, top-left, top-right, bottom-left, bottom-right)
    const ALLOWED_LEGEND = ["auto", "top-left", "top-right", "bottom-left", "bottom-right"] as const;
    type LegendPos = (typeof ALLOWED_LEGEND)[number];
    let legendPosition: LegendPos = "auto";
    if ((ALLOWED_LEGEND as readonly string[]).includes(legendParam)) {
      legendPosition = legendParam as LegendPos;
    }

    if (!CHART_SIZES.includes(size)) {
      size = "laptop";
    }

    // Combined cache key: includes both legendPosition (#529) and startDate (#527)
    const svgCacheKey = `${repos.join(",")}|${type}|${size}|${theme}|${transparent}|${legendPosition}|${useLogScale}|${startDate ?? ""}`;
    const cachedSvg = svgCache.get(svgCacheKey);
    if (cachedSvg) {
      recordCacheHit("svgChart");
      return c.body(cachedSvg, 200, SVG_HEADERS);
    }
    recordCacheMiss("svgChart");

    const repoData = [];
    const nodataRepos = [];

    for (const repo of repos) {
      const cacheData = cache.get(repo);

      if (cacheData) {
        recordCacheHit("starData");
        repoData.push({
          repo,
          starRecords: cacheData.starRecords,
          logoUrl: cacheData.logoUrl,
        });
      } else {
        recordCacheMiss("starData");
        nodataRepos.push(repo);
      }
    }

    if (nodataRepos.length > 0) {
      const token = getNextToken();
      if (!token) {
        return c.text("All GitHub API tokens are rate-limited, try again later", 503);
      }

      try {
        const data = await getRepoData(nodataRepos, token, MAX_REQUEST_AMOUNT);

        // Fetch all logos in parallel (bounded by MAX_REPOS_PER_REQUEST)
        await Promise.all(data.map(async (d) => {
          d.logoUrl = await getBase64Image(`${d.logoUrl}&size=22`);
          cache.set(d.repo, {
            starRecords: d.starRecords,
            starAmount: d.starRecords[d.starRecords.length - 1].count,
            logoUrl: d.logoUrl,
          });
          repoData.push(d);
        }));
      } catch (error: any) {
        const status = error.status || 400;
        const message =
          error.message || "Some unexpected error happened, try again later";

        if (status === 403) {
          markTokenExhausted(token);
        }

        return c.text(message, status);
      }
    }

    const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
    const body = dom.window.document.querySelector("body");
    const svg = dom.window.document.createElement(
      "svg"
    ) as unknown as SVGSVGElement;

    if (!dom || !body || !svg) {
      return c.text("Failed to mock dom with JSDOM", 500);
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
          data: convertDataToChartData(repoData, type, { startDate }),
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
      return c.text(`Failed to generate chart, ${error}`, 500);
    }

    const svgContent = fixJsdomSvgCasing(svg.outerHTML);
    const optimized = optimize(svgContent, { multipass: true }).data;
    svgCache.set(svgCacheKey, optimized);

    return c.body(optimized, 200, SVG_HEADERS);
  });

  const banner = `
     _______.___________.    ___      .______          __    __   __       _______.___________.  ______   .______     ____    ____
    /       |           |   /   \\     |   _  \\        |  |  |  | |  |     /       |           | /  __  \\  |   _  \\    \\   \\  /   /
   |   (----\`---|  |----\`  /  ^  \\    |  |_)  |       |  |__|  | |  |    |   (----\`---|  |----\`|  |  |  | |  |_)  |    \\   \\/   /
    \\   \\       |  |      /  /_\\  \\   |      /        |   __   | |  |     \\   \\       |  |     |  |  |  | |      /      \\_    _/
.----)   |      |  |     /  _____  \\  |  |\\  \\----.   |  |  |  | |  | .----)   |      |  |     |  \`--'  | |  |\\  \\----.   |  |
|_______/       |__|    /__/     \\__\\ | _| \`._____|   |__|  |__| |__| |_______/       |__|      \\______/  | _| \`._____|   |__|
`;
  serve({ fetch: app.fetch, port: 8080 }, () => {
    console.log(banner);
    console.log(`  commit: ${process.env.GIT_COMMIT || "unknown"}\n`);
    logger.info("server running on port 8080");
  });
};

startServer();
