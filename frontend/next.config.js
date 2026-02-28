const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    webpack: (config) => {
        config.resolve.alias["@shared"] = path.resolve(__dirname, "../shared");
        return config;
    },
}

module.exports = nextConfig
