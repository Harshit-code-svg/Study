import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { cn } from "@/lib/utils"
import Nav from "@/components/nav"
import BottomNav from "@/components/bottom-nav"
import InstallPrompt from "@/components/install-prompt"
import PWAInit from "@/components/pwa-init"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "STUDYMAP — Game-layer Study Tracker",
  description: "Crush boss chapters, build streaks, earn XP. Spaced revision + daily challenges. 100% localStorage.",
  manifest: "/manifest.json",
  applicationName: "STUDYMAP",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "STUDYMAP",
  },
  formatDetection: { telephone: false },
  authors: [{ name: "STUDYMAP" }],
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png" }],
  },
}

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "min-h-screen bg-[#09090f] text-zinc-100 antialiased")}>
        <div className="mx-auto max-w-6xl px-4 pb-24 md:pb-10">
          <Nav />
          <main className="pb-2">{children}</main>
        </div>
        <BottomNav />
        <InstallPrompt />
        <PWAInit />
        <Toaster richColors theme="dark" position="top-center" />
      </body>
    </html>
  )
}
