import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { amount, category, description, date } = body;

    if (!amount || !category || !description || !date) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        category,
        description,
        date: new Date(date),
        userId,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error("[EXPENSES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || undefined;
    const timeframe = searchParams.get("timeframe") || "all";
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as Prisma.SortOrder;

    // Calculate date range based on timeframe
    let dateFilter: { gte?: Date; lte?: Date } = {};
    const now = new Date();
    
    switch (timeframe) {
      case "today":
        dateFilter = {
          gte: new Date(now.setHours(0, 0, 0, 0)),
          lte: new Date(now.setHours(23, 59, 59, 999)),
        };
        break;
      case "week":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        dateFilter = {
          gte: startOfWeek,
          lte: now,
        };
        break;
      case "month":
        dateFilter = {
          gte: new Date(now.getFullYear(), now.getMonth(), 1),
          lte: now,
        };
        break;
      case "year":
        dateFilter = {
          gte: new Date(now.getFullYear(), 0, 1),
          lte: now,
        };
        break;
    }

    // Build where clause
    const where: Prisma.ExpenseWhereInput = {
      userId,
      ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      ...(category && { category }),
      ...(search && {
        OR: [
          {
            description: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            category: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
    };

    // Get total count for pagination
    const total = await prisma.expense.count({ where });

    // Get expenses with pagination and sorting
    const expenses = await prisma.expense.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return NextResponse.json({
      expenses,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("[EXPENSES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
