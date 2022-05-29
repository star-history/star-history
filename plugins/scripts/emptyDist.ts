import { existsSync, mkdirSync, rmSync } from "fs";
import { resolve } from "path";

const emptyDist = () => {
  try {
    const distPath = resolve(__dirname, "../../dist");
    if (existsSync(distPath)) {
      rmSync(distPath, {
        recursive: true,
      });
    }
    mkdirSync(distPath);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default emptyDist;
