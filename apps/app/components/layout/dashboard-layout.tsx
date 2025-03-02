"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, CreditCard, Home, Plus, Settings, Wallet, MessageSquareText, Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Sheet, SheetContent, SheetTrigger } from "@workspace/ui/components/sheet"
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Dashboard",
    },
    {
      href: "/dashboard/transactions",
      icon: CreditCard,
      label: "Transactions",
    },
    {
      href: "/dashboard/wallets",
      icon: Wallet,
      label: "Wallets",
    },
    {
      href: "/dashboard/analytics",
      icon: BarChart3,
      label: "Analytics",
    },
    {
      href: "/dashboard/assistant",
      icon: MessageSquareText,
      label: "Assistant",
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      label: "Settings",
    },
  ]

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Mobile Nav */}
      <div className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted",
                    pathname === route.href ? "text-primary font-semibold" : "text-muted-foreground",
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto">
              <AddExpenseDialog>
                <Button className="w-full mt-6">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </AddExpenseDialog>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Woretto</span>
        </div>
        <div className="flex items-center gap-4">
          <AddExpenseDialog>
            <Button size="sm" className="rounded-full h-8 px-3">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </AddExpenseDialog>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-[270px] flex-col border-r bg-background md:flex">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Wallet className="h-6 w-6 text-primary" />
              <span>Woretto</span>
            </Link>
          </div>
          <nav className="grid gap-1 p-4 text-sm font-medium lg:px-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted transition-colors",
                  pathname === route.href ? "bg-muted text-primary font-semibold" : "text-muted-foreground",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto p-4 lg:px-6">
            <AddExpenseDialog>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </AddExpenseDialog>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

