
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import  SessionProviderWrapper from "../app/providers/SessionProviderWrapper";
import "./globals.css";
import { Navbar } from "./components/layout/NavBar";
import { Footer } from "./components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillShare Hub - Learn Skills, Share Knowledge",
  description: "Discover thousands of free and paid courses from expert instructors. Master new skills and advance your career with SkillShare Hub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SessionProviderWrapper>
          <Navbar/>
          <main className="flex-1">
            {children}
          </main>
          <Footer/>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
