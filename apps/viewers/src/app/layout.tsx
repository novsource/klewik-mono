import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";
import "./globals.css";

const golosText = Golos_Text({
  variable: "--font-golos-text",
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  title: "Просмотр аукционов | Klewik",
  description:
    "На этом сайте вы можете просмотреть актуальные, участвующие в аукционе стример",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${golosText.variable} antialiased`}>{children}</body>
    </html>
  );
}
