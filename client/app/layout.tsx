import SupabaseProvider from "@/providers/supabase-provider";
import PHProvider from "@/providers/posthog-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

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
        <PHProvider>
          <SupabaseProvider>{children}</SupabaseProvider>
        </PHProvider>
        <Toaster />
      </body>
    </html>
  );
}
