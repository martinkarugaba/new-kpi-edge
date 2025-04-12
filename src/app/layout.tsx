import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/features/themes/providers/theme-provider";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ActiveThemeProvider } from "@/features/themes/components/active-theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KPI Tracking",
  description: "Track your KPIs across organizations and projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ActiveThemeProvider>
              <SidebarProvider defaultOpen={true}>
                {children}
                <Toaster />
              </SidebarProvider>
            </ActiveThemeProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
