'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/app/components/NavBar";
import React, {useState} from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [isExpanded, setIsExpanded] = useState(false);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavBar isExpanded={isExpanded} setIsExpanded={setIsExpanded}/>
        <main
            className={`
            min-h-screen
            transition-all
            duration-300
            pt-4
            px-4
            md:pt-6
            md:px-6
            ${isExpanded ? 'md:ml-[280px]' : 'md:ml-[80px]'}
          `}
        >
            {children}
        </main>
      </body>
    </html>
  );
}
