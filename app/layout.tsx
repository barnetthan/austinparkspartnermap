import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button"; 
import { headers } from "next/headers"; // Already imported!
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Austin Parks Admin",
  description: "Management dashboard for Austin Parks",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Get the current path from headers
  const headerList = await headers();
  // Next.js standard way to get the current URL in server components
  const pathname = headerList.get("x-url") || ""; 
  
  // 2. Check if we are in the /auth folder
  // If headers don't have x-url, we can also check the referer or use a Middleware approach
  const isAuthPage = pathname.includes("/auth");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          enableSystem
        >
          {/* 3. Wrap the header in a conditional: ONLY show if NOT on an auth page */}
          {!isAuthPage && (
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
                {user && <Link href="/admin/admins">Admin</Link>}
                
                <div style={{ marginLeft: "auto" }} />
                
                {user ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "12px", opacity: 0.6 }}>{user.email}</span>
                    <LogoutButton />
                  </div>
                ) : (
                  <Link href="/auth/login">Login</Link>
                )}
              </nav>
            </header>
          )}

          <main style={{ padding: "16px" }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}