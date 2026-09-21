import localFont from "next/font/local";

/** Display font for marketing homepage headlines only. */
export const chillax = localFont({
  src: [
    {
      path: "../../public/fonts/Chillax_Complete/Fonts/WEB/fonts/Chillax-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Chillax_Complete/Fonts/WEB/fonts/Chillax-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-chillax",
});
