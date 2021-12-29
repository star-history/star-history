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
      width: {
        "640px": "640px",
      },
      height: {
        "52px": "52px",
      },
      minHeight: {
        "400px": "400px",
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
