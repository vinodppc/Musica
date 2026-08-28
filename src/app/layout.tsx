import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Musica — Connect through music",
  description:
    "Upload your music, share it with the world, and connect with producers who can help you finish the track.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Nav />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 sm:py-10">
          {children}
        </main>
        <footer className="border-t border-border py-8 text-center text-sm text-muted">
          Built for musicians and producers to connect.
        </footer>
      </body>
    </html>
  );
}
