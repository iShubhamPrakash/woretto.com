"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Calendar } from "@workspace/ui/components/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import { format } from "date-fns"
import { CalendarIcon, ArrowRightLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@workspace/ui/components/textarea"

interface TransferDialogProps {
  children: React.ReactNode
}

const wallets = [
  { id: "1", name: "Cash", balance: 580.25 },
  { id: "2", name: "Bank Account", balance: 8250.0 },
  { id: "3", name: "Savings Account", balance: 3750.0 },
]

export function TransferDialog({ children }: TransferDialogProps) {
  const [date, setDate] = useState<Date>()
  const [fromWallet, setFromWallet] = useState("")
  const [toWallet, setToWallet] = useState("")
  const [amount, setAmount] = useState("")
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transfer Money</DialogTitle>
          <DialogDescription>
            Transfer money between your wallets to keep track of internal movements.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fromWallet" className="text-right">
                From
              </Label>
              <Select value={fromWallet} onValueChange={setFromWallet}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select source wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id} disabled={wallet.id === toWallet}>
                      {wallet.name} (${wallet.balance.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-center">
              <div className="rounded-full bg-muted p-2">
                <ArrowRightLeft className="h-4 w-4" />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="toWallet" className="text-right">
                To
              </Label>
              <Select value={toWallet} onValueChange={setToWallet}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select destination wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id} disabled={wallet.id === fromWallet}>
                      {wallet.name} (${wallet.balance.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("col-span-3 justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="notes" className="text-right pt-2">
                Notes
              </Label>
              <Textarea id="notes" placeholder="Add any additional details" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!fromWallet || !toWallet || !amount || !date}>
              Transfer Money
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

