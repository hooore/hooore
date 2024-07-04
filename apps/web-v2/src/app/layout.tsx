import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PageScroll } from "@repo/smooth-scroll/react/page-scroll";
import "./globals.css";
import { cn } from "@repo/utils";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Suspense } from "react";
import { Toaster } from "@/components/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hooore",
  description: "Turning Tech Dreams into Happy Realities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "ss-bg-page-background")}>
        <Suspense>
          <Navbar />
        </Suspense>
        <PageScroll>
          {children}
          <Footer />
        </PageScroll>
        <Toaster />
      </body>
    </html>
  );
}
