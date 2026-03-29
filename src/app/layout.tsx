import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Subha Shree Bhawan",
  description: "Luxury residential property showcase",
  icons: {
    icon: "/subhashree.png",
    shortcut: "/subhashree.png",
    apple: "/subhashree.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
