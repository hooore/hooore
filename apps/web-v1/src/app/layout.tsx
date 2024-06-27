import "@repo/component-v1/styles.css";
import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavBar } from "@/components/navbar";
import { Suspense } from "react";
import { ScrollContainer } from "@/components/scroll-container";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hooore",
  description: "Something awesome is coming soon. Be first to know.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense>
          <NavBar />
        </Suspense>
        <ScrollContainer>{children}</ScrollContainer>
      </body>
    </html>
  );
}