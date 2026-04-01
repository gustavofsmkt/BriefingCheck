import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/shared/AppHeader";
import { AppFooter } from "@/components/shared/AppFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BriefingCheck | Validacao de Criativos com IA",
  description: "Plataforma para auditar criativos com IA e validar alinhamento com briefing em segundos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-950 text-zinc-100">
        <div className="relative flex min-h-screen flex-col">
          <AppHeader />
          <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 md:py-20">{children}</main>
          <AppFooter />
        </div>
      </body>
    </html>
  );
}
