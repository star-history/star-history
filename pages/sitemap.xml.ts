import blogs from '../helpers/blog.json';
import { Blog } from '../helpers/types/blog'; // Assuming you have defined Blog type in types.ts or similar
import path from 'path';

const generateSitemap = (blogs) => {
    const uniqueUrls = new Set();

    // Add the homepage URL
    uniqueUrls.add("https://www.star-history.com");
    uniqueUrls.add("https://www.star-history.com/blog");

    // Add URLs for each blog post
    blogs.forEach(blog => {
        uniqueUrls.add(`https://www.star-history.com/blog/${blog.slug}`);
    });

    // Construct the sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">`;

    uniqueUrls.forEach(url => {
        sitemap += `
    <url>
        <loc>${url}</loc>
    </url>`;
    });

    sitemap += `
</urlset>`;

    return sitemap;
};

const SiteMap = () => { };

export const getServerSideProps = async ({ res }: any) => {
    const sitemap = generateSitemap(blogs);

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
};

export default SiteMap;
