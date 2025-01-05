'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const expenseFormSchema = z.object({
  amount: z.string().refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  category: z.string({
    required_error: "Please select a category",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters",
  }),
  date: z.string({
    required_error: "Please select a date",
  }),
});

const categories = [
  "food-dining",
  "transportation",
  "shopping",
  "entertainment",
  "bills-utilities",
  "health-fitness",
  "travel",
  "other",
] as const;

const categoryLabels: Record<string, string> = {
  "food-dining": "Food & Dining",
  "transportation": "Transportation",
  "shopping": "Shopping",
  "entertainment": "Entertainment",
  "bills-utilities": "Bills & Utilities",
  "health-fitness": "Health & Fitness",
  "travel": "Travel",
  "other": "Other",
};

interface ExpenseFormProps {
  onSuccess?: () => void;
  initialData?: {
    id: string;
    amount: number;
    category: string;
    description: string;
    date: string;
  };
}

export function ExpenseForm({ onSuccess, initialData }: ExpenseFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: initialData?.amount?.toString() || "",
      category: initialData?.category || "food-dining",
      description: initialData?.description || "",
      date: initialData?.date || new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = useCallback(async (values: z.infer<typeof expenseFormSchema>) => {
    try {
      const response = await fetch(`/api/expenses${initialData ? `/${initialData.id}` : ''}`, {
        method: initialData ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          category: categoryLabels[values.category],
        }),
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(initialData ? 'Failed to update expense' : 'Failed to add expense');
      }

      await response.json();
      
      toast({
        title: "Success",
        description: initialData 
          ? `Updated expense: $${values.amount} for ${values.description}`
          : `Added expense: $${values.amount} for ${values.description}`,
      });
      
      form.reset();
      router.refresh(); // Refresh the page data
      onSuccess?.(); // Close the dialog
    } catch (error) {
      toast({
        title: "Error",
        description: initialData 
          ? "Failed to update expense. Please try again."
          : "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    }
  }, [form, initialData, onSuccess, router]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter amount"
                  type="number"
                  step="0.01"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {categoryLabels[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {initialData ? 'Update' : 'Add'} Expense
        </Button>
      </form>
    </Form>
  );
}
