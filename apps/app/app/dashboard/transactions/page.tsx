"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@workspace/ui/components/drawer"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import {
  ShoppingBag,
  Coffee,
  Car,
  Film,
  Home,
  ArrowDownRight,
  ArrowUpRight,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpDown,
  Upload,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog"
import { TransferDialog } from "@/components/transfers/transfer-dialog"
import { ImportTransactionsDialog } from "@/components/transactions/import-transactions-dialog"
import { AdvancedFiltersDialog } from "@/components/transactions/advanced-filters-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

const transactions = [
  {
    id: "1",
    date: "2023-06-01",
    merchant: "Amazon",
    category: "Shopping",
    amount: -89.99,
    wallet: "Credit Card",
    icon: ShoppingBag,
  },
  {
    id: "2",
    date: "2023-06-02",
    merchant: "Starbucks",
    category: "Food & Dining",
    amount: -5.75,
    wallet: "Cash",
    icon: Coffee,
  },
  {
    id: "3",
    date: "2023-06-03",
    merchant: "Uber",
    category: "Transportation",
    amount: -24.5,
    wallet: "Bank Account",
    icon: Car,
  },
  {
    id: "4",
    date: "2023-06-04",
    merchant: "Cinema",
    category: "Entertainment",
    amount: -15.0,
    wallet: "Cash",
    icon: Film,
  },
  {
    id: "5",
    date: "2023-06-05",
    merchant: "Salary",
    category: "Income",
    amount: 2500.0,
    wallet: "Bank Account",
    icon: Home,
  },
  {
    id: "6",
    date: "2023-06-06",
    merchant: "Grocery Store",
    category: "Food & Dining",
    amount: -75.25,
    wallet: "Credit Card",
    icon: ShoppingBag,
  },
  {
    id: "7",
    date: "2023-06-07",
    merchant: "Gas Station",
    category: "Transportation",
    amount: -45.0,
    wallet: "Credit Card",
    icon: Car,
  },
  {
    id: "8",
    date: "2023-06-08",
    merchant: "Netflix",
    category: "Entertainment",
    amount: -14.99,
    wallet: "Bank Account",
    icon: Film,
  },
  {
    id: "9",
    date: "2023-06-09",
    merchant: "Rent",
    category: "Housing",
    amount: -1200.0,
    wallet: "Bank Account",
    icon: Home,
  },
  {
    id: "10",
    date: "2023-06-10",
    merchant: "Freelance Work",
    category: "Income",
    amount: 750.0,
    wallet: "Bank Account",
    icon: Home,
  },
]

const categories = ["all", ...new Set(transactions.map((t) => t.category))]
const wallets = ["all", ...new Set(transactions.map((t) => t.wallet))]

const quickFilters = [
  { id: "all", label: "All Transactions" },
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "this-week", label: "This Week" },
  { id: "this-month", label: "This Month" },
  { id: "income", label: "Income Only" },
  { id: "expenses", label: "Expenses Only" },
]

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [walletFilter, setWalletFilter] = useState("all")
  const [quickFilter, setQuickFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 768px)")

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch =
        transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter
      const matchesWallet = walletFilter === "all" || transaction.wallet === walletFilter
      const matchesQuickFilter =
        quickFilter === "all" ||
        (quickFilter === "income" && transaction.amount > 0) ||
        (quickFilter === "expenses" && transaction.amount < 0)

      return matchesSearch && matchesCategory && matchesWallet && matchesQuickFilter
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

  const FilterContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h3 className="mb-4 text-sm font-medium">Quick Filters</h3>
        <div className="space-y-2">
          {quickFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={quickFilter === filter.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setQuickFilter(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <h3 className="mb-4 text-sm font-medium">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={categoryFilter === category ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCategoryFilter(category)}
            >
              {category === "all" ? "All Categories" : category}
            </Button>
          ))}
        </div>
      </div>
      <div className="px-3 py-2">
        <h3 className="mb-4 text-sm font-medium">Wallets</h3>
        <div className="space-y-2">
          {wallets.map((wallet) => (
            <Button
              key={wallet}
              variant={walletFilter === wallet ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setWalletFilter(wallet)}
            >
              {wallet === "all" ? "All Wallets" : wallet}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row">
        {/* Desktop Sidebar Filters */}
        {isDesktop && (
          <div className="w-64 border-r bg-background">
            <ScrollArea className="h-screen">
              <FilterContent />
            </ScrollArea>
          </div>
        )}

        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
            <div className="flex flex-wrap items-center gap-2">
              {!isDesktop && (
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Filters</DrawerTitle>
                    </DrawerHeader>
                    <ScrollArea className="h-[calc(100vh-8rem)]">
                      <FilterContent />
                    </ScrollArea>
                  </DrawerContent>
                </Drawer>
              )}
              <AdvancedFiltersDialog>
                <Button variant="outline" size="sm">
                  Advanced Filters
                </Button>
              </AdvancedFiltersDialog>
              <ImportTransactionsDialog>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </ImportTransactionsDialog>
              <TransferDialog>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Transfer
                </Button>
              </TransferDialog>
              <AddExpenseDialog>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </AddExpenseDialog>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>View, search, and filter all your transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  title={`Sort by date ${sortOrder === "asc" ? "newest first" : "oldest first"}`}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Wallet</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="mr-2 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                <transaction.icon className="h-4 w-4" />
                              </div>
                              {transaction.merchant}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{transaction.category}</Badge>
                          </TableCell>
                          <TableCell>{transaction.wallet}</TableCell>
                          <TableCell
                            className={cn(
                              "text-right font-medium",
                              transaction.amount > 0 ? "text-emerald-500" : "text-rose-500",
                            )}
                          >
                            <div className="flex items-center justify-end">
                              {transaction.amount > 0 ? (
                                <ArrowUpRight className="mr-1 h-4 w-4" />
                              ) : (
                                <ArrowDownRight className="mr-1 h-4 w-4" />
                              )}
                              ${Math.abs(transaction.amount).toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

