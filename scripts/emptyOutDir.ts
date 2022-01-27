import { existsSync, mkdirSync, rmdirSync } from "fs";
import { resolve } from "path";

const emptyOutDir = () => {
  try {
    const distPath = resolve(__dirname, "../dist");
    if (existsSync(distPath)) {
      rmdirSync(distPath, {
        recursive: true,
      });
    }
    mkdirSync(distPath);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default emptyOutDir;
