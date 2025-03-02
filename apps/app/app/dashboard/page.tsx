import { Wallet, TrendingUp, TrendingDown, DollarSign, PiggyBank, CreditCard, ArrowRight } from "lucide-react"
import Link from "next/link"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Progress } from "@workspace/ui/components/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { ExpenseChart } from "@/components/dashboard/expense-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { SpendingByCategory } from "@/components/dashboard/spending-by-category"
import { AddWalletDialog } from "@/components/wallets/add-wallet-dialog"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center gap-2">
              <AddWalletDialog>
                <Button variant="outline" size="sm">
                  <Wallet className="mr-2 h-4 w-4" />
                  Add Wallet
                </Button>
              </AddWalletDialog>
            </div>
          </div>

          {/* Account Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,580.25</div>
                <p className="text-xs text-muted-foreground">+$2,100.00 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$4,550.00</div>
                <p className="text-xs text-muted-foreground">+$350.00 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,345.75</div>
                <p className="text-xs text-muted-foreground">-$120.50 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings</CardTitle>
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,204.25</div>
                <p className="text-xs text-muted-foreground">48.5% of monthly goal</p>
                <Progress value={48.5} className="mt-2 h-1" />
              </CardContent>
            </Card>
          </div>

          {/* Wallets */}
          <div>
            <h3 className="mb-4 text-lg font-medium">Your Wallets</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cash</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$580.25</div>
                </CardContent>
                <CardFooter>
                  <Link
                    href="/dashboard/wallets"
                    className="text-xs text-muted-foreground hover:text-primary flex items-center"
                  >
                    View Details <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bank Account</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$8,250.00</div>
                </CardContent>
                <CardFooter>
                  <Link
                    href="/dashboard/wallets"
                    className="text-xs text-muted-foreground hover:text-primary flex items-center"
                  >
                    View Details <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Savings Account</CardTitle>
                  <PiggyBank className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$3,750.00</div>
                </CardContent>
                <CardFooter>
                  <Link
                    href="/dashboard/wallets"
                    className="text-xs text-muted-foreground hover:text-primary flex items-center"
                  >
                    View Details <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Analytics */}
          <Tabs defaultValue="expenses" className="space-y-4">
            <TabsList>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="savings">Savings</TabsTrigger>
            </TabsList>
            <TabsContent value="expenses" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Expense Overview</CardTitle>
                    <CardDescription>Your spending pattern over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ExpenseChart />
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                    <CardDescription>Top spending categories this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SpendingByCategory />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="income" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Income Overview</CardTitle>
                  <CardDescription>Your income sources and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Income analytics will appear here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="savings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Savings Overview</CardTitle>
                  <CardDescription>Your savings progress and goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Savings analytics will appear here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest 5 transactions</CardDescription>
              </div>
              <Link href="/dashboard/transactions">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

