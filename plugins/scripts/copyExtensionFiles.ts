import { copyFileSync } from "fs";
import { resolve } from "path";

const copyExtensionFiles = () => {
  try {
    copyFileSync(
      resolve(__dirname, "../../src/extension/background.js"),
      resolve(__dirname, "../../dist/background.js")
    );
    copyFileSync(
      resolve(__dirname, "../../src/extension/manifest.json"),
      resolve(__dirname, "../../dist/manifest.json")
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default copyExtensionFiles;
