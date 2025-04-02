import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/features/themes/providers/theme-provider";
import { ActiveThemeProvider } from "@/features/themes/components/active-theme";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ActiveThemeProvider>{children}</ActiveThemeProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
