module.exports = {
  content: [
    "./index.html",
    "./src/extension/popup.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "RGB(54, 54, 54)",
        light: "RGB(245, 245, 245)",
      },
      maxWidth: {
        "800px": "800px",
      },
      minWidth: {
        "600px": "600px",
      },
      height: {
        "52px": "52px",
      },
      minHeight: {
        "400px": "400px",
      },
      spacing: {
        112: "28rem",
        128: "32rem",
        144: "36rem",
        160: "40rem",
        176: "44rem",
        192: "48rem",
      },
      boxShadow: {
        focus: "0 0 0 0.125em rgb(54 54 54 / 25%)",
      },
      zIndex: {
        100: "100",
      },
    },
  },
  plugins: [],
};
