import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Origin of the Universe",
  description: "A cinematic journey through time and space.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png" }],
  },
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
