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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Plus, X } from "lucide-react"

interface AdvancedFiltersDialogProps {
  children: React.ReactNode
}

type FilterCondition = {
  id: string
  field: string
  operator: string
  value: string
}

type FilterGroup = {
  id: string
  conjunction: "AND" | "OR"
  conditions: FilterCondition[]
}

export function AdvancedFiltersDialog({ children }: AdvancedFiltersDialogProps) {
  const [open, setOpen] = useState(false)
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([
    {
      id: "1",
      conjunction: "AND",
      conditions: [{ id: "1", field: "amount", operator: "greater-than", value: "" }],
    },
  ])

  const fields = [
    { value: "amount", label: "Amount" },
    { value: "category", label: "Category" },
    { value: "wallet", label: "Wallet" },
    { value: "date", label: "Date" },
    { value: "merchant", label: "Merchant" },
    { value: "type", label: "Transaction Type" },
  ]

  const operators = [
    { value: "equals", label: "Equals" },
    { value: "not-equals", label: "Does not equal" },
    { value: "contains", label: "Contains" },
    { value: "greater-than", label: "Greater than" },
    { value: "less-than", label: "Less than" },
    { value: "between", label: "Between" },
  ]

  const addFilterGroup = () => {
    setFilterGroups((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        conjunction: "AND",
        conditions: [{ id: Date.now().toString(), field: "amount", operator: "greater-than", value: "" }],
      },
    ])
  }

  const removeFilterGroup = (groupId: string) => {
    setFilterGroups((prev) => prev.filter((group) => group.id !== groupId))
  }

  const addCondition = (groupId: string) => {
    setFilterGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            conditions: [
              ...group.conditions,
              { id: Date.now().toString(), field: "amount", operator: "greater-than", value: "" },
            ],
          }
        }
        return group
      }),
    )
  }

  const removeCondition = (groupId: string, conditionId: string) => {
    setFilterGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            conditions: group.conditions.filter((condition) => condition.id !== conditionId),
          }
        }
        return group
      }),
    )
  }

  const updateCondition = (
    groupId: string,
    conditionId: string,
    field: "field" | "operator" | "value",
    value: string,
  ) => {
    setFilterGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            conditions: group.conditions.map((condition) => {
              if (condition.id === conditionId) {
                return { ...condition, [field]: value }
              }
              return condition
            }),
          }
        }
        return group
      }),
    )
  }

  const updateGroupConjunction = (groupId: string, conjunction: "AND" | "OR") => {
    setFilterGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          return { ...group, conjunction }
        }
        return group
      }),
    )
  }

  const handleApplyFilters = () => {
    // Handle filter application
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>Create complex filters with multiple conditions.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {filterGroups.map((group, groupIndex) => (
            <div key={group.id} className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Select
                    value={group.conjunction}
                    onValueChange={(value: "AND" | "OR") => updateGroupConjunction(group.id, value)}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AND">AND</SelectItem>
                      <SelectItem value="OR">OR</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">{groupIndex === 0 ? "Where" : "And where"}</span>
                </div>
                {filterGroups.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeFilterGroup(group.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {group.conditions.map((condition) => (
                  <div key={condition.id} className="flex items-center gap-2">
                    <Select
                      value={condition.field}
                      onValueChange={(value) => updateCondition(group.id, condition.id, "field", value)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fields.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={condition.operator}
                      onValueChange={(value) => updateCondition(group.id, condition.id, "operator", value)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map((operator) => (
                          <SelectItem key={operator.value} value={operator.value}>
                            {operator.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      value={condition.value}
                      onChange={(e) => updateCondition(group.id, condition.id, "value", e.target.value)}
                      className="flex-1"
                      placeholder="Enter value"
                    />

                    {group.conditions.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeCondition(group.id, condition.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button variant="outline" size="sm" onClick={() => addCondition(group.id)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Condition
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addFilterGroup}>
            <Plus className="mr-2 h-4 w-4" />
            Add Filter Group
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

