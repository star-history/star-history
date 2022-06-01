import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import additionBuildPlugin from "./plugins/additionBuildPlugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), additionBuildPlugin()],
});
