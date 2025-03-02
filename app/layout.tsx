import "@/app/globals.css"
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs';
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Woretto - Expense Tracking, Effortlessly Intelligent",
  description:
    "Woretto uses AI to automatically track and categorize your expenses, giving you insights and recommendations to optimize your spending.",
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
