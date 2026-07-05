import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Origin of the Universe",
  description: "A cinematic journey through time and space.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-black">{children}</body>
    </html>
  );
}
