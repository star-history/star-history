import { defineConfig, UserConfigExport } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config: UserConfigExport = {
    plugins: [vue()],
    build: {
      emptyOutDir: true,
    },
  };

  if (mode === "extension") {
    config.root = "./src";
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
  }

  return config;
});
