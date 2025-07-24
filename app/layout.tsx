import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KlickTools - Find the Smartest Tools on the Web",
  description:
    "Discover and explore the best AI tools, productivity apps, and utilities on the web.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Animated Stars Background */}
        <div className="stars-bg">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="star" />
          ))}
        </div>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
