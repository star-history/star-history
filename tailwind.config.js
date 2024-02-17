/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            fontFamily: {
                inter: ["Inter", "sans-serif"]
            },
            colors: {
                dark: "RGB(54, 54, 54)",
                light: "RGB(245, 245, 245)"
            },
            minWidth: {
                "600px": "600px"
            },
            minHeight: {
                "400px": "400px"
            },
            boxShadow: {
                focus: "0 0 0 0.125em rgb(54 54 54 / 25%)"
            },
            zIndex: {
                100: "100"
            },
            spacing: {
                52: "13rem",
                112: "28rem",
                128: "32rem",
                152: "38rem",
                160: "40rem",
                176: "44rem",
                192: "48rem",
                208: "52rem"
            }
        }
    },
    plugins: [require("@tailwindcss/typography"), require("@tailwindcss/line-clamp")]
}
