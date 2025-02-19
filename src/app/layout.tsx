import type { Metadata } from "next";
import { Delius, Inter, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TanstackQueryProvider } from "@/lib/tanstack.query";

const delius = Inter({weight: ['400', '400'], subsets: ['latin']});

export const metadata: Metadata = {
  title: "LawStack",
  description: "A legal tech platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(`antialiased selection:bg-green-600/20 selection:text-green-600`, delius.className)}
        suppressHydrationWarning
      >
        <TanstackQueryProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
            {children}
          </ThemeProvider>

          <Toaster
            position="top-right"
            richColors
            duration={5000}
          />
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
