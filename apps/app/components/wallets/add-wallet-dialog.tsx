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
import { Wallet, CreditCard, PiggyBank, Briefcase } from "lucide-react"

interface AddWalletDialogProps {
  children: React.ReactNode
}

export function AddWalletDialog({ children }: AddWalletDialogProps) {
  const [open, setOpen] = useState(false)
  const [walletType, setWalletType] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setOpen(false)
  }

  const walletTypes = [
    { value: "cash", label: "Cash", icon: Wallet },
    { value: "bank", label: "Bank Account", icon: CreditCard },
    { value: "savings", label: "Savings Account", icon: PiggyBank },
    { value: "investment", label: "Investment Account", icon: Briefcase },
    { value: "custom", label: "Custom", icon: Wallet },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Wallet</DialogTitle>
          <DialogDescription>Create a new wallet to track your finances.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" placeholder="My Wallet" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select onValueChange={setWalletType}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select wallet type" />
                </SelectTrigger>
                <SelectContent>
                  {walletTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center">
                        <type.icon className="mr-2 h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="balance" className="text-right">
                Initial Balance
              </Label>
              <Input id="balance" type="number" step="0.01" placeholder="0.00" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currency" className="text-right">
                Currency
              </Label>
              <Select defaultValue="usd">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="jpy">JPY (¥)</SelectItem>
                  <SelectItem value="cad">CAD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {walletType === "bank" && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bank-name" className="text-right">
                    Bank Name
                  </Label>
                  <Input id="bank-name" placeholder="Bank of America" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="account-number" className="text-right">
                    Account Number
                  </Label>
                  <Input id="account-number" placeholder="Last 4 digits" className="col-span-3" />
                </div>
              </>
            )}
            {walletType === "custom" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input id="description" placeholder="Additional details" className="col-span-3" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Create Wallet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

