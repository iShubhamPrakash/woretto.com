import "@/app/globals.css"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Woretto - AI-Powered Expense Tracking",
  description: "Harness AI to plan, track, and save smartly with Woretto, your personal finance companion.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

