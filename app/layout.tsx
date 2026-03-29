import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unified Dashboard",
  description: "Manage all your platforms from one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
