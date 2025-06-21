import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ASCII Social - Terminal-Style Social Media",
  description: "A retro ASCII art social media platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-green-400 font-mono antialiased">{children}</body>
    </html>
  )
}
