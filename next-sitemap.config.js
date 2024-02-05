// next-sitemap.js

module.exports = {
  siteUrl: "http://localhost:3000", // Update with your local development server URL
  generateRobotsTxt: true,
  // Add a custom function to modify the sitemap entries
  async xmlExport({ allPages, ...config }) {
    // Modify the entries or add custom logic here
    const modifiedEntries = allPages.map((entry) => {
      // Example: Add a custom attribute to each URL
      return {
        ...entry,
        customAttribute: "custom-value",
      };
    });

    // Return the modified entries
    return modifiedEntries;
  },
};
