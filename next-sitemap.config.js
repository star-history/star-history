module.exports = {
    siteUrl: 'http://localhost:3000', // Replace with your actual site URL
    generateRobotsTxt: true,
    async generateRoutes() {
      // Fetch dynamic paths and generate routes
      const dynamicPaths = await fetchDynamicPaths(); // Implement this function to fetch dynamic paths
      
      // Map dynamic paths to an array of route objects
      const routes = dynamicPaths.map(id => ({
        route: `/`,
        route: `/blog/`,
        route: `/blog/${slug}`, // Assuming dynamic routes are under /post/:id
      }));
      
      return routes;
    },
  }
  