import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

interface Route {
  url: string;
  name: string;
}

const staticRoutes: Route[] = [
  {
    url: "/",
    name: "Star History",
  },
  {
    url: "/embed",
    name: "Star History",
  },
  {
    url: "/blog",
    name: "Blog List",
  },
];

const getBlogsRoutes = async (): Promise<Route[]> => {
  const rawdata = readFileSync(resolve(__dirname, "../public/blog/data.json"));
  const blogs = JSON.parse(rawdata.toString());

  const blogRoutes: Route[] = [];

  for (const blog of blogs) {
    blogRoutes.push({
      url: `/blog/${blog.slug}`,
      name: blog.title,
    });
  }

  return blogRoutes;
};

const generateSitemap = async () => {
  const routes = [...staticRoutes];
  const blogRoutes = await getBlogsRoutes();
  routes.push(...blogRoutes);
  const baseUrl = "https://star-history.com";

  const routeXMLTags: string[] = [];
  for (const route of routes) {
    routeXMLTags.push(`<url>
  <loc>${baseUrl}${route.url}</loc>
</url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${routeXMLTags.join("\n")}
</urlset>`;

  writeFileSync(resolve(__dirname, "../public/sitemap.xml"), xml);
};

export default generateSitemap;
