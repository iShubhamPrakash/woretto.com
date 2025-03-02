"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Wallet, CreditCard, PiggyBank, Briefcase, MoreHorizontal, Plus, Edit, Trash2, ArrowUpDown } from "lucide-react"
import { Progress } from "@workspace/ui/components/progress"
import { AddWalletDialog } from "@/components/wallets/add-wallet-dialog"
import { TransferDialog } from "@/components/transfers/transfer-dialog"

const wallets = [
  {
    id: "1",
    name: "Cash",
    type: "cash",
    balance: 580.25,
    currency: "USD",
    icon: Wallet,
  },
  {
    id: "2",
    name: "Bank Account",
    type: "bank",
    balance: 8250.0,
    currency: "USD",
    icon: CreditCard,
    details: {
      bankName: "Chase Bank",
      accountNumber: "****4567",
    },
  },
  {
    id: "3",
    name: "Savings Account",
    type: "savings",
    balance: 3750.0,
    currency: "USD",
    icon: PiggyBank,
    details: {
      bankName: "Wells Fargo",
      accountNumber: "****7890",
    },
  },
  {
    id: "4",
    name: "Investment Portfolio",
    type: "investment",
    balance: 12500.0,
    currency: "USD",
    icon: Briefcase,
    details: {
      broker: "Vanguard",
      accountNumber: "****2345",
    },
  },
]

export default function WalletsPage() {
  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0)

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Wallets</h2>
            <div className="flex items-center gap-2">
              <TransferDialog>
                <Button variant="outline">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Transfer
                </Button>
              </TransferDialog>
              <AddWalletDialog>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Wallet
                </Button>
              </AddWalletDialog>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Total Balance</CardTitle>
              <CardDescription>Combined balance across all your wallets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">${totalBalance.toFixed(2)}</div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wallets.map((wallet) => (
              <Card key={wallet.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center">
                    <div className="mr-2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <wallet.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{wallet.name}</CardTitle>
                      <CardDescription>
                        {wallet.type === "bank" && wallet.details?.bankName}
                        {wallet.type === "savings" && wallet.details?.bankName}
                        {wallet.type === "investment" && wallet.details?.broker}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Wallet
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Transfer Money
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        View Transactions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Wallet
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${wallet.balance.toFixed(2)}</div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Percentage of Total</span>
                      <span>{((wallet.balance / totalBalance) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(wallet.balance / totalBalance) * 100} className="h-1" />
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 p-3">
                  <div className="text-xs text-muted-foreground">
                    {wallet.type === "bank" && wallet.details?.accountNumber && (
                      <span>Account: {wallet.details.accountNumber}</span>
                    )}
                    {wallet.type === "savings" && wallet.details?.accountNumber && (
                      <span>Account: {wallet.details.accountNumber}</span>
                    )}
                    {wallet.type === "investment" && wallet.details?.accountNumber && (
                      <span>Account: {wallet.details.accountNumber}</span>
                    )}
                    {wallet.type === "cash" && <span>Physical cash</span>}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

