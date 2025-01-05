'use client';

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface Category {
  name: string;
  amount: number;
  percentage: number;
}

interface CategoryData {
  total: number;
  categories: Category[];
}

export function SpendingCategories() {
  const [data, setData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await fetch('/api/expenses/categories');
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || 'Failed to fetch categories');
        }
        const data = await response.json();
        setData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error instanceof Error ? error.message : 'Failed to load spending categories');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data || data.categories.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>No spending data available yet.</p>
        <p className="text-sm mt-1">Add some expenses to see your spending breakdown.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline">
        <h3 className="font-semibold">Categories</h3>
        <span className="text-sm text-gray-500">Total: ${data.total.toFixed(2)}</span>
      </div>
      
      <div className="space-y-3">
        {data.categories.map((category) => (
          <div key={category.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{category.name}</span>
              <span className="text-gray-500">${category.amount.toFixed(2)}</span>
            </div>
            <Progress value={category.percentage} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
