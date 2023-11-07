import SupabaseProvider from "@/providers/supabase-provider";

import PHProvider from "@/providers/posthog-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/theme-provider";
import { ThemeToggle } from "@/components/home/ThemeToggle";

export const metadata = {
  title: "Suparepo",
  description: "A repo for Next.js (App Router) + Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PHProvider>
            <ThemeToggle />
            <SupabaseProvider>{children}</SupabaseProvider>
          </PHProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
