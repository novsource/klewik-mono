import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";
import "./globals.css";

const golosText = Golos_Text({
  variable: "--font-golot-text",
  subsets: ["cyrillic", "latin"],
});

export const metadata: Metadata = {
  title: "Просмотр аукционов | Klewik",
  description:
    "На этом сайте вы можете просмотреть актуальные, участвующие в аукционе стримерf",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${golosText.variable} antialiased`}>{children}</body>
    </html>
  );
}
