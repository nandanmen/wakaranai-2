import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fontJp = Noto_Sans_JP({
  variable: "--font-jp",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${fontJp.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-100 flex flex-col`}
      >
        <div className="p-6 grow flex flex-col">
          <div className="border-neutral-300 border-b left-0 right-0 top-6 fixed" />
          <div className="border-neutral-300 border-t left-0 right-0 bottom-6 fixed" />
          <div className="border-neutral-300 border-b top-[calc(41px+theme(spacing.6))] left-0 right-0 fixed" />
          <div className="border-neutral-300 border-b top-[calc(42px+theme(spacing.6)+theme(spacing.2))] left-0 right-0 fixed" />
          <div className="grow flex flex-col gap-2 relative max-w-[1400px] mx-auto w-full">
            <div className="border-neutral-300 border-r -top-6 -bottom-6 absolute" />
            <div className="border-neutral-300 border-l -top-6 -bottom-6 right-0 absolute" />
            <header className="relative bg-white border border-neutral-500 p-2 pr-3 h-[42px] flex items-center gap-1.5">
              <span className="font-jp">分</span>
              <span>wakaranai</span>
              <Link className="ml-auto" href="/words">
                words
              </Link>
              <Link href="/quiz">quiz</Link>
            </header>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
