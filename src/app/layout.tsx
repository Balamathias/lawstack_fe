import type { Metadata } from "next";
import { Delius, Inter, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TanstackQueryProvider } from "@/lib/tanstack.query";
import ModeToggle from "@/components/mode-toggle";

import NextTopLoader from "nextjs-toploader";

const inter = Inter({weight: ['300', '400', '500', '600'], subsets: ['latin'], variable: '--font-inter'});

export const metadata: Metadata = {
  title: "Law Stack",
  description: "A simplistic law stack for learning law and legal practices. Gain access to past questions, notes, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(`antialiased selection:bg-green-600/20 selection:text-green-600 font-inter`, inter.className,)}
        suppressHydrationWarning
      >
        <NextTopLoader 
          showSpinner={false}
          color="lightgreen"
        />
        <TanstackQueryProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
            {children}
            {/* <ModeToggle /> */}
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
