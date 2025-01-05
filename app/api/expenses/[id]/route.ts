import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { amount, category, description, date } = body;
    const { id } = await context.params;

    // Verify expense belongs to user
    const existingExpense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!existingExpense) {
      return new NextResponse("Expense not found", { status: 404 });
    }

    if (existingExpense.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        category,
        description,
        date: date ? new Date(date) : undefined,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error("[EXPENSE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await context.params;

    // Verify expense belongs to user
    const existingExpense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!existingExpense) {
      return new NextResponse("Expense not found", { status: 404 });
    }

    if (existingExpense.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.expense.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[EXPENSE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
