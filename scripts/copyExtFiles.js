/* eslint-disable no-undef */
const fs = require("fs");
const path = require("path");

try {
  fs.copyFileSync(
    path.resolve(__dirname, "../src/extension/background.js"),
    path.resolve(__dirname, "../dist/background.js")
  );

  fs.copyFileSync(
    path.resolve(__dirname, "../src/extension/manifest.json"),
    path.resolve(__dirname, "../dist/manifest.json")
  );
} catch (error) {
  console.error(error);
  throw error;
}
