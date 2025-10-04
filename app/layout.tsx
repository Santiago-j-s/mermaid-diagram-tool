import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mermaid Wave",
  description:
    "Create and edit Mermaid diagrams with live preview, syntax validation, and AI-powered suggestions",
  keywords: ["mermaid", "diagram", "flowchart", "visualization", "markdown"],
  authors: [{ name: "Santiago Santana" }, { name: "Lara Mateo" }],
  openGraph: {
    title: "Mermaid Wave",
    description:
      "Create and edit Mermaid diagrams with live preview, syntax validation, and AI-powered suggestions",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Toaster richColors />
        <Analytics />
      </body>
    </html>
  );
}
