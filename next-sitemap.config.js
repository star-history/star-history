module.exports = {
    siteUrl: 'https://star-history.com',
    generateRobotsTxt: true, // (optional) Generate a robots.txt file
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', disallow: '/_next/' },
            { userAgent: '*', disallow: '/embed' },
        ],
    },
  };
  