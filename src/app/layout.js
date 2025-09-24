import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import "react-tooltip/dist/react-tooltip.css";
import Script from "next/script";
import { AppContextProvider } from "@/context/appContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Emaar Map",
  description: "Emaar Map",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
          strategy="beforeInteractive"
        />
        <link
          href="https://vjs.zencdn.net/7.1.0/video-js.css"
          rel="stylesheet"
          type="text/css"
        />

        <Script
          src="https://vjs.zencdn.net/7.1.0/video.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/js/videojs-pannellum-plugin.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${poppins.variable} antialiased`}
      >
        <AppContextProvider>{children}</AppContextProvider>
      </body>
    </html>
  );
}
