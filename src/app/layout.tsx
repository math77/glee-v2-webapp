import type { Metadata } from "next";
import { Geist, Geist_Mono, Pixelify_Sans, Fraunces } from "next/font/google";
import "./globals.css";

import Web3Provider from "./Web3Provider";
import { SITE_URL } from "@/utils/siteConfig";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const pixelify = Pixelify_Sans({ variable: "--font-pixelify-sans", subsets: ["latin"], weight: ["400", "700"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "GLEE — Onchain Gorgeous Art",
  description: "Generative. Onchain. Alive. Yours",
  openGraph: { title: "GLEE — Onchain Pixel Art", description: ".", url: SITE_URL, siteName: "GLEE" },
  twitter: { card: "summary_large_image", title: "GLEE — Onchain Art", description: "." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${pixelify.variable} ${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}

