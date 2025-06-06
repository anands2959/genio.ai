'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import ToastProvider from "./components/providers/ToastProvider";
import {metadata} from "./metadata";
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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased metadata:${metadata}`}
      >
        <SessionProvider>
          <ToastProvider />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
