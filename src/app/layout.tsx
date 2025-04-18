import type { Metadata } from "next";
import { Delius, Inter, Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TanstackQueryProvider } from "@/lib/tanstack.query";

import NextTopLoader from "nextjs-toploader";

const inter = Roboto({ weight: ['300', '400', '500', '600'], subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: "Law Stack - Legal Resources, Past Questions & Notes",
    template: "%s | Law Stack"
  },
  description: "Law Stack is your comprehensive platform for learning law and legal practices. Access past law exam questions, detailed notes, legal resources, and more to excel in your legal studies.",
  keywords: [
    "Law Stack", "LawStack", "LawStak", "Law Stak", "Law Stakc", "Legal Resources", "Law Notes", "Past Questions", "Legal Studies", "Law Exams", "Law Practice", "Legal Education", "Law Students", "Legal Platform",
    "Law School", "Legal Advice", "Law Textbooks", "Law Syllabus", "Law Revision", "Law Faculty", "Law Courses", "Law Materials", "Law Tutorials", "Law Guides",
    "Legal Research", "Law Questions and Answers", "Law Exam Preparation", "Law Study Materials", "Law Reference", "Law Case Studies", "Law Practice Questions",
    "Law University", "Law Degree", "Legal Knowledge", "Legal Learning", "Law Resources Online", "Law Study Platform", "Law Exam Help", "Law Notes Download"
  ],
  authors: [{ name: "Law Stack Team", url: "https://www.lawstack.me" }],
  creator: "Law Stack Team",
  publisher: "Law Stack",
  metadataBase: new URL("https://www.lawstack.me"),
  alternates: {
    canonical: "https://www.lawstack.me",
  },
  openGraph: {
    type: "website",
    url: "https://www.lawstack.me",
    title: "Law Stack - Legal Resources, Past Questions & Notes",
    description: "Law Stack is your comprehensive platform for learning law and legal practices. Access past law exam questions, detailed notes, legal resources, and more to excel in your legal studies.",
    siteName: "Law Stack",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Law Stack - Legal Resources, Past Questions & Notes",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@lawstack",
    title: "Law Stack - Legal Resources, Past Questions & Notes",
    description: "Law Stack is your comprehensive platform for learning law and legal practices. Access past law exam questions, detailed notes, legal resources, and more.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(`antialiased selection:bg-primary/20 selection:text-primary font-inter`, inter.className,)}
        suppressHydrationWarning
      >
        <NextTopLoader 
          showSpinner={false}
          color="var(--primary)"
        />
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
