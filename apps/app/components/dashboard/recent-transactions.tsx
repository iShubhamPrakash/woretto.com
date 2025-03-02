"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { ShoppingBag, Coffee, Car, Film, Home, ArrowDownRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@workspace/ui/components/badge"

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
]

export function RecentTransactions() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Merchant</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Wallet</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
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
              className={cn("text-right font-medium", transaction.amount > 0 ? "text-emerald-500" : "text-rose-500")}
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

