module.exports = {
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/typescript/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "no-empty-pattern": "warn",
    "no-useless-escape": "warn",
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "vue/multi-word-component-names": "off",
    "vue/require-default-prop": "off",
    "@typescript-eslint/no-namespace": "off",
  },
  ignorePatterns: ["node_modules", "build", "dist", "public"],
  overrides: [
    {
      files: ["./*.js"],
      env: {
        node: true,
      },
    },
  ],
};
