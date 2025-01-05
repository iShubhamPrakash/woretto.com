'use client';

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { ExpenseActions } from './expense-actions';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface PaginationInfo {
  total: number;
  pages: number;
  currentPage: number;
}

interface TransactionsResponse {
  expenses: Expense[];
  pagination: PaginationInfo;
}

interface RecentTransactionsProps {
  timeframe?: string;
}

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "Food & Dining", label: "Food & Dining" },
  { value: "Transportation", label: "Transportation" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Health & Fitness", label: "Health & Fitness" },
  { value: "Shopping", label: "Shopping" },
  { value: "Others", label: "Others" },
] as const;

export function RecentTransactions({ timeframe = 'all' }: RecentTransactionsProps) {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    pages: 1,
    currentPage: 1,
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        timeframe,
        ...(search && { search }),
        ...(category !== 'all' && { category }),
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/expenses?${queryParams}`, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data: TransactionsResponse = await response.json();
      setTransactions(data.expenses);
      setPagination(data.pagination);
    } catch (error) {
      setError('Failed to load transactions');
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [timeframe, search, category, sortBy, sortOrder, page]);

  // Initial fetch and setup router refresh listener
  useEffect(() => {
    fetchTransactions();
    router.refresh(); // Ensure we're showing the latest data
  }, [fetchTransactions, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchTransactions();
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (transactions.length === 0) {
    return <div className="text-center text-gray-500 py-4">No transactions found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('date')}>
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('description')}>
                Description {sortBy === 'description' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="text-right cursor-pointer" onClick={() => handleSort('amount')}>
                Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell className="text-right">
                  ${transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <ExpenseActions expense={transaction} onUpdate={fetchTransactions} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {transactions.length} of {pagination.total} transactions
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= pagination.pages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
