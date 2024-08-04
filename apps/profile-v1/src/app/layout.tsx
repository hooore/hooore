import "./globals.css";
import "@repo/components-v1/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@repo/utils";
import { Toaster } from "@/components/toaster";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hooore",
  description: "Turning Tech Dreams into Happy Realities",
  icons: [
    {
      rel: "icon",
      type: "image/x-icon",
      url: "/favicon-light.ico",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      type: "image/x-icon",
      url: "/favicon-dark.ico",
      media: "(prefers-color-scheme: dark)",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "ss-bg-page-background")}>
        {children}
        <Toaster />
        <Script
          defer
          src="https://analytics.hooore.com/script.js"
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
        />
      </body>
    </html>
  );
}
