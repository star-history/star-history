module.exports = {
    siteUrl: 'https://www.star-history.com',
    outDir: 'out',
    generateRobotsTxt: true,
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', disallow: '/_next/' },
            { userAgent: '*', disallow: '/embed' },
        ],
    },
};
  