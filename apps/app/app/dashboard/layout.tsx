import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Woretto Dashboard",
  description: "Manage your finances with Woretto's AI-powered expense tracking",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}

