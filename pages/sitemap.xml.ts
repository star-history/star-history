import blogs from '../helpers/blog.json';

const generateSitemap = (blogs: any[]) => {
    const uniqueUrls = new Set();

    // Add the homepage URL
    uniqueUrls.add("https://star-history.com");
    uniqueUrls.add("https://star-history.com/blog");

    // Add URLs for each blog post
    blogs.forEach(blog => {
        uniqueUrls.add(`https://star-history.com/blog/${blog.slug}`);
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
