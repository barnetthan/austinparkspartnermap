import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Austin Partners Map",
  description: "Explore Austin partners and the places they help shape.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(245,232,196,0.9),transparent_70%)]" />
            <header className="sticky top-0 z-20 border-b border-primary/10 bg-background/90 backdrop-blur">
              <div className="flex px-3 py-3 sm:px-5 lg:px-7">
                <Suspense fallback={<div className="text-sm text-muted-foreground">Loading navigation...</div>}>
                  <Navbar />
                </Suspense>
              </div>
            </header>

            <main className="relative px-3 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
