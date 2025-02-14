import type { Metadata } from "next";
import "./globals.css";
import RainbowProviders from "@/components/providers/rainbow-providers";

export const metadata: Metadata = {
  title: "Tako Anon Test App",
  description: "Tako Anon Test App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <RainbowProviders>{children}</RainbowProviders>
      </body>
    </html>
  );
}
