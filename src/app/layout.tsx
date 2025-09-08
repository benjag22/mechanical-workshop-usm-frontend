'use client'

import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import NavBar from "@/app/components/NavBar";
import React, {useState} from "react";
import {cn} from "@/app/cn";

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
            className={`${geistSans.variable} ${geistMono.variable} antialiasing`}
        >
        <div className={cn(
            "min-h-screen grid transition-all duration-300",
            isExpanded
                ? "grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]"
                : "grid-cols-[70px_1fr] lg:grid-cols-[80px_1fr]"
        )}>
            <NavBar isExpanded={isExpanded} setIsExpanded={setIsExpanded}/>
            <main className={cn("min-h-screen overflow-x-hidden")}>
                {children}
            </main>
        </div>
        </body>
        </html>
    );
}
