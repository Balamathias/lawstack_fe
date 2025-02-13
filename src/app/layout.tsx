import type { Metadata } from "next";
import { Delius } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const delius = Delius({weight: ['400', '400'], subsets: ['latin']});

export const metadata: Metadata = {
  title: "legalX",
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
        className={cn(`antialiased selection:bg-sky-600/20 selection:text-sky-600`, delius.className)}
        suppressHydrationWarning
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
