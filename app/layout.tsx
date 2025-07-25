import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KlickTools - Find the Smartest Tools on the Web",
  description:
    "Discover and explore the best AI tools, productivity apps, and utilities on the web.",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
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
