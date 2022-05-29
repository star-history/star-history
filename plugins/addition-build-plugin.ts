import copyExtensionFiles from "./scripts/copyExtensionFiles";
import emptyDist from "./scripts/emptyDist";
import generateSitemap from "./scripts/generateSitemap";

const additionBuildPlugin = () => {
  let envCommand = "";
  let envMode = "";

  return {
    name: "addition-build-plugin",
    config(config, { command, mode }) {
      envCommand = command;
      envMode = mode;

      if (mode === "extension") {
        config.root = "./src";
        config.publicDir = "../public";
        config.build = {
          ...config.build,
          outDir: "../dist",
          rollupOptions: {
            input: {
              popup: "./src/extension/popup.html",
            },
          },
        };
      }
    },
    buildStart() {
      // Empty the dist folder firstly to make sure the other script can work right.
      emptyDist();
    },
    buildEnd() {
      if (envCommand === "build") {
        if (envMode === "extension") {
          copyExtensionFiles();
        } else {
          generateSitemap();
        }
      }
    },
  };
};

export default additionBuildPlugin;
