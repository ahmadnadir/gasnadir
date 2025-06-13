import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import SideNav from "@/components/side-nav"
import NewsPanel from "@/components/news-panel"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "GenGasIQ - Gas Volume Analytics Platform",
  description: "AI-powered platform for gas volume analysis, forecasting, and reporting",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex h-screen">
            <SideNav />
            <main className="flex-1 overflow-y-auto p-4">{children}</main>
            <NewsPanel />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
