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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"

interface ImportTransactionsDialogProps {
  children: React.ReactNode
}

type ColumnMapping = {
  sourceColumn: string
  targetField: string
}

const requiredFields = [
  { value: "date", label: "Date" },
  { value: "amount", label: "Amount" },
  { value: "merchant", label: "Merchant" },
  { value: "category", label: "Category" },
  { value: "wallet", label: "Wallet" },
  { value: "type", label: "Transaction Type" },
  { value: "notes", label: "Notes" },
  { value: "ignore", label: '  label: "Transaction Type' },
  { value: "notes", label: "Notes" },
  { value: "ignore", label: "Ignore this column" },
]

export function ImportTransactionsDialog({ children }: ImportTransactionsDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<string[][]>([])
  const [columnMapping, setColumnMapping] = useState<ColumnMapping[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      return
    }

    setFile(file)
    // Read and parse CSV file
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const rows = text.split("\n")
        .filter(row => row.trim().length > 0)  // Remove empty rows
        .map(row => row.split(",").map(cell => cell.trim()));  // Split and trim cells
      
      setPreviewData(rows)
      
      // Initialize column mapping only if we have header row
      if (rows.length > 0) {
        const headerRow = rows[0] as string[];  // We know this exists because of the length check
        setColumnMapping(
          headerRow.map((column) => ({
            sourceColumn: column,
            targetField: "ignore",
          }))
        )
        setStep(2)
        setError(null)
      } else {
        setError("The CSV file appears to be empty")
        setStep(1)
      }
    }
    reader.readAsText(file)
  }

  const handleColumnMappingChange = (sourceColumn: string, targetField: string) => {
    setColumnMapping((prev) =>
      prev.map((mapping) => {
        if (mapping.sourceColumn === sourceColumn) {
          return { ...mapping, targetField }
        }
        return mapping
      }),
    )
  }

  const validateMapping = () => {
    const requiredMapped = ["date", "amount", "merchant"].every((field) =>
      columnMapping.some((mapping) => mapping.targetField === field),
    )
    if (!requiredMapped) {
      setError("Please map the required fields: Date, Amount, and Merchant")
      return false
    }
    return true
  }

  const handleImport = () => {
    if (!validateMapping()) return

    // Process import
    setOpen(false)
    setStep(1)
    setFile(null)
    setPreviewData([])
    setColumnMapping([])
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Import Transactions</DialogTitle>
          <DialogDescription>Upload a CSV file with your transaction data.</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 1 && (
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">CSV files only</p>
                </div>
                <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Map Columns</h3>
              <p className="text-sm text-muted-foreground">
                Match your CSV columns to the corresponding fields in Woretto.
              </p>
            </div>

            <ScrollArea className="h-[400px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CSV Column</TableHead>
                    <TableHead>Maps To</TableHead>
                    <TableHead>Preview</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {columnMapping.map((mapping, index) => (
                    <TableRow key={mapping.sourceColumn}>
                      <TableCell>{mapping.sourceColumn}</TableCell>
                      <TableCell>
                        <Select
                          value={mapping.targetField}
                          onValueChange={(value) => handleColumnMappingChange(mapping.sourceColumn, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {requiredFields.map((field) => (
                              <SelectItem key={field.value} value={field.value}>
                                {field.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{previewData[1]?.[index]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        <DialogFooter>
          {step === 2 && (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleImport}>Import Transactions</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

