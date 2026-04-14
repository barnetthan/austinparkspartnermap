import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import "./globals.css";

// Use the live site address in production and localhost while developing.
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
  // Check whether someone is signed in before the page loads.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          enableSystem
        >
          {/* Send the signed-in user to the navigation bar. */}
          <Navbar initialUser={user} />

          <main style={{ padding: "16px" }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
