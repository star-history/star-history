module.exports = {
    siteUrl: 'http://localhost:3000',
    generateRobotsTxt: true,
    // Define dynamic routes
    async generateRoutes() {
      // Fetch dynamic routes from an API or any other source
      const dynamicRoutes = await fetchDynamicRoutes(); // Implement this function to fetch your dynamic routes
      
      // Return an array of objects with the necessary route information
      return dynamicRoutes.map(route => ({
        route: `/dynamic/${route.id}`, // Define the route URL
        changefreq: 'daily', // Specify the change frequency (optional)
        priority: 0.7, // Specify the priority (optional)
      }));
    },
  }
  