import { defineConfig, UserConfigExport } from "vite";
import vue from "@vitejs/plugin-vue";
import copyExtensionFiles from "./scripts/copyExtensionFiles";
import emptyOutDir from "./scripts/emptyOutDir";
import generateSitemap from "./scripts/generateSitemap";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Control the building behavior and make its first step to empty the output folder.
  // This is to make sure the other script can work right.
  emptyOutDir();

  const config: UserConfigExport = {
    plugins: [vue()],
    build: {},
  };

  if (mode === "extension") {
    config.root = "./src";
    config.publicDir = "../public";
    config.build = {
      ...config.build,
      outDir: "../dist",
      terserOptions: {
        mangle: false,
      },
      rollupOptions: {
        input: {
          popup: "./extension/popup.html",
        },
      },
    };

    if (command === "build") {
      copyExtensionFiles();
    }
  } else {
    generateSitemap();
  }

  return config;
});
