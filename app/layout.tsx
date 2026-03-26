import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Austin Parks Foundation Partner Map",
  description: "Partner map and admin portal for Austin Parks Foundation",
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
          <header className="border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75">
            <nav className="mx-auto flex w-full max-w-6xl items-center gap-4">
              <Link href="/" className="font-extrabold tracking-wide text-[#0a2b52]">
                Austin Parks Foundation
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Partner Map
              </Link>
              <Link
                href="/admin"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Admin
              </Link>
              <div className="ml-auto" />
              <Link
                href="/auth/login"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Login
              </Link>
            </nav>
          </header>
          <main className="mx-auto w-full max-w-6xl px-4 py-6">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
