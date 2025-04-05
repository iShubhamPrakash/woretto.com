import { db } from '../db';
import { loans, borrowerProfiles, loanShares, users } from '../schema';
import { eq, and, or, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';

export interface CreateLoanWithBorrowerInput {
  lenderId: number;
  type: 'given' | 'received';
  principalAmount: number;
  interestRate?: number;
  startDate: Date;
  dueDate?: Date;
  description?: string;
  walletAccountId: number;
  // Borrower information
  borrowerName: string;
  borrowerEmail?: string;
  borrowerPhone?: string;
  borrowerUserId?: number; // If borrower is already registered
}

export interface InviteBorrowerInput {
  loanId: number;
  email: string;
  message?: string;
}

export async function createLoanWithBorrower(input: CreateLoanWithBorrowerInput) {
  return await db.transaction(async (tx: PgTransaction<PostgresJsQueryResultHKT>) => {
    // Create or update borrower profile
    const borrowerProfile = await tx.insert(borrowerProfiles)
      .values({
        name: input.borrowerName,
        email: input.borrowerEmail,
        phone: input.borrowerPhone,
        status: input.borrowerUserId ? 'registered' : 'unregistered',
        userId: input.borrowerUserId,
      })
      .returning()
      .then((rows: typeof borrowerProfiles.$inferSelect[]) => rows[0]);

    if (!borrowerProfile) {
      throw new Error('Failed to create borrower profile');
    }

    // Create the loan
    const loan = await tx.insert(loans)
      .values({
        type: input.type,
        principalAmount: sql`${input.principalAmount}`,
        interestRate: input.interestRate ? sql`${input.interestRate}` : null,
        startDate: input.startDate,
        dueDate: input.dueDate,
        description: input.description,
        lenderId: input.lenderId,
        borrowerId: input.borrowerUserId,
        borrowerProfileId: borrowerProfile.id,
        walletAccountId: input.walletAccountId,
      } as any)
      .returning()
      .then((rows: typeof loans.$inferSelect[]) => rows[0]);

    if (!loan) {
      throw new Error('Failed to create loan');
    }

    // If borrower is registered, create a loan share
    if (input.borrowerUserId) {
      await tx.insert(loanShares)
        .values({
          loanId: loan.id,
          userId: input.borrowerUserId,
          type: 'view',
        });
    }

    return { loan, borrowerProfile };
  });
}

export async function inviteBorrower(input: InviteBorrowerInput) {
  return await db.transaction(async (tx: PgTransaction<PostgresJsQueryResultHKT>) => {
    // Generate a unique invitation token
    const invitationToken = uuidv4();

    // Update borrower profile with invitation details
    const updatedProfile = await tx.update(borrowerProfiles)
      .set({
        status: 'pending_registration',
        // Store invitation token in a separate column if needed
      })
      .where(eq(borrowerProfiles.id, input.loanId))
      .returning()
      .then((rows: typeof borrowerProfiles.$inferSelect[]) => rows[0]);

    if (!updatedProfile) {
      throw new Error('Failed to update borrower profile');
    }

    // Here you would typically:
    // 1. Send an email to the borrower with the invitation link
    // 2. Store the invitation token in a separate table if needed
    // 3. Set up any invitation expiration logic

    return updatedProfile;
  });
}

export async function linkBorrowerToUser(borrowerProfileId: number, userId: number) {
  return await db.transaction(async (tx: PgTransaction<PostgresJsQueryResultHKT>) => {
    // Update borrower profile
    const updatedProfile = await tx.update(borrowerProfiles)
      .set({
        userId,
        status: 'registered',
      })
      .where(eq(borrowerProfiles.id, borrowerProfileId))
      .returning()
      .then((rows: typeof borrowerProfiles.$inferSelect[]) => rows[0]);

    if (!updatedProfile) {
      throw new Error('Failed to update borrower profile');
    }

    // Update all loans for this borrower
    await tx.update(loans)
      .set({
        borrowerId: userId,
      })
      .where(eq(loans.borrowerProfileId, borrowerProfileId));

    // Create loan shares for all loans
    const borrowerLoans = await tx.select()
      .from(loans)
      .where(eq(loans.borrowerProfileId, borrowerProfileId));

    for (const loan of borrowerLoans) {
      await tx.insert(loanShares)
        .values({
          loanId: loan.id,
          userId,
          type: 'view',
        });
    }

    return updatedProfile;
  });
}

export async function getBorrowerLoans(userId: number) {
  return await db.select()
    .from(loans)
    .leftJoin(borrowerProfiles, eq(loans.borrowerProfileId, borrowerProfiles.id))
    .where(
      or(
        eq(loans.borrowerId, userId),
        eq(borrowerProfiles.userId, userId)
      )
    );
}

export async function getLenderLoans(userId: number) {
  return await db.select()
    .from(loans)
    .leftJoin(borrowerProfiles, eq(loans.borrowerProfileId, borrowerProfiles.id))
    .where(eq(loans.lenderId, userId));
}

export async function getPendingRegistrations() {
  return await db.select()
    .from(borrowerProfiles)
    .where(eq(borrowerProfiles.status, 'pending_registration'));
} 