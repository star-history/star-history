const path = require("path");

const sharedDir = path.resolve(__dirname, "../shared");
const arenaDataDir = path.resolve(__dirname, "../arena/data");

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    webpack: (config, { defaultLoaders }) => {
        config.resolve.alias["@shared"] = sharedDir;
        config.resolve.alias["@arena-data"] = arenaDataDir;
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            include: [sharedDir],
            use: defaultLoaders.babel,
        });
        return config;
    },
}

module.exports = nextConfig
