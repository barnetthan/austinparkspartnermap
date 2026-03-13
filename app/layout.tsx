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
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
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
          <header
            style={{
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              padding: "12px 16px",
            }}
          >
            <nav
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                width: "100%",
              }}
            >
              <Link href="/">Home</Link>
              <Link href="/admin">Admin</Link>
              <div style={{ marginLeft: "auto" }} />
              <Link href="/auth/login">Login</Link>
            </nav>
          </header>
          <main style={{ padding: "16px" }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
