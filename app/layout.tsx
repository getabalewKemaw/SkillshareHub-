

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import  SessionProviderWrapper from "../app/providers/SessionProviderWrapper";
import "./globals.css";
import { Navbar } from "./components/layout/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "skill share hub",
  description: "get  both free and   paid courses in the skill  share hub ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <SessionProviderWrapper> <Navbar/>
        {children}
        </SessionProviderWrapper>
       
      </body>
    </html>
  );
}
