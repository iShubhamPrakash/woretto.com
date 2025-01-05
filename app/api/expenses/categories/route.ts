import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the date range from query params or default to current month
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate") 
      ? new Date(searchParams.get("startDate")!) 
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // Get total expenses for the period
    const totalExpenses = await prisma.expense.aggregate({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Get expenses grouped by category
    const categoryExpenses = await prisma.expense.groupBy({
      by: ['category'],
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Calculate percentages and format response
    const total = totalExpenses._sum.amount || 0;

    // If no expenses exist, return default categories
    if (categoryExpenses.length === 0) {
      return NextResponse.json({
        total: 0,
        categories: [
          { name: 'Food & Dining', amount: 0, percentage: 0 },
          { name: 'Transportation', amount: 0, percentage: 0 },
          { name: 'Shopping', amount: 0, percentage: 0 },
          { name: 'Entertainment', amount: 0, percentage: 0 },
          { name: 'Bills & Utilities', amount: 0, percentage: 0 },
        ]
      });
    }

    const categories = categoryExpenses.map((category) => ({
      name: category.category,
      amount: category._sum.amount || 0,
      percentage: total > 0 ? ((category._sum.amount || 0) / total) * 100 : 0,
    }));

    return NextResponse.json({
      total,
      categories,
    });
  } catch (error) {
    console.error('Error in categories API:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500 }
    );
  }
}
