module.exports = {
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-namespace": "off",
    "vue/multi-word-component-names": "off",
    "vue/require-default-prop": "off",
  },
  ignorePatterns: ["node_modules", "dist", "public"],
  overrides: [
    {
      files: ["./**/*.js"],
      env: {
        node: true,
      },
      rules: {
        "no-undef": "off",
      },
    },
    {
      files: ["*.vue"],
      rules: {
        "no-undef": "off",
      },
    },
  ],
};
