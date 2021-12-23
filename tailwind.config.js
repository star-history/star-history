module.exports = {
  content: [
    "./index.html",
    "./src/extension/popup.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        112: "28rem",
        128: "32rem",
        144: "36rem",
        160: "40rem",
        176: "44rem",
        192: "48rem",
      },
    },
  },
  plugins: [],
};
