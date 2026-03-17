import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LayoutContainer } from "@/components/layout-container";

const geistSans = Geist({
  variable: "--font-sans", // Mude de --font-geist-sans para --font-sans
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Análise Acadêmica",
  description:
    "Análise Acadêmica é uma plataforma de análise de dados acadêmicos, fornecendo insights e visualizações para estudantes, professores e pesquisadores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LayoutContainer>{children}</LayoutContainer>
        </ThemeProvider>
      </body>
    </html>
  );
}
