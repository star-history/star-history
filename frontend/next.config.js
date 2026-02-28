const path = require("path");

const sharedDir = path.resolve(__dirname, "../shared");
const ghDataDir = path.resolve(__dirname, "../gh/data");

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    webpack: (config, { defaultLoaders }) => {
        config.resolve.alias["@shared"] = sharedDir;
        config.resolve.alias["@gh-data"] = ghDataDir;
        // Ensure shared/ code can resolve packages from frontend/node_modules,
        // and preserve bare-import resolution (e.g. "store", "helpers/toast")
        // by including the frontend directory itself as a module root.
        config.resolve.modules = [
            __dirname,
            path.resolve(__dirname, "node_modules"),
            "node_modules",
        ];
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            include: [sharedDir],
            use: defaultLoaders.babel,
        });
        return config;
    },
}

module.exports = nextConfig
