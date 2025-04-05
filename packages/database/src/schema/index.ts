import { pgTable, serial, text, timestamp, varchar, pgEnum, numeric, boolean, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const walletAccountTypes = pgEnum('wallet_account_types', ['general', 'current_account', 'saving_account', 'credit_card', 'cash', 'investment', 'loan', 'other']);
export const supportedCurrencies = pgEnum('supported_currencies', ['INR', 'USD']);

export const walletAccounts = pgTable('wallet_accounts', {
  id: serial('id').primaryKey(),
  type: walletAccountTypes('type').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  balance: numeric('balance', { precision: 10, scale: 2 }).default('0'),
  currency: supportedCurrencies('currency').notNull(),
  color: text('color'),
  icon: text('icon'),
  excludeFromStats: boolean('exclude_from_stats').notNull().default(false),
  accountNumber: text('account_number'),
  paymentDueDate: timestamp('payment_due_date'),
  archived: boolean('archived').notNull().default(false),
  userId: serial('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const walletTransactionTypes = pgEnum('wallet_transaction_types', ['deposit', 'withdrawal', 'transfer_out', 'transfer_in', 'loan_payment']);
export const walletTransactionStatuses = pgEnum('wallet_transaction_statuses', ['verified', 'unverified']);

export const transfers = pgTable('transfers', {
  id: serial('id').primaryKey(),
  sourceWalletAccountId: serial('source_wallet_account_id').references(() => walletAccounts.id),
  destinationWalletAccountId: serial('destination_wallet_account_id').references(() => walletAccounts.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const walletTransactions = pgTable('wallet_transactions', {
  id: serial('id').primaryKey(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  type: walletTransactionTypes('type').notNull(),
  note: text('note'),
  status: walletTransactionStatuses('status').notNull().default('verified'),
  receipts: text('receipts').array(),
  walletAccountId: serial('wallet_account_id').references(() => walletAccounts.id),
  transferId: serial('transfer_id').references(() => transfers.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const loanTypes = pgEnum('loan_types', ['given', 'received']);
export const loanStatuses = pgEnum('loan_statuses', ['active', 'completed', 'defaulted']);

export const borrowerStatuses = pgEnum('borrower_statuses', ['registered', 'unregistered', 'pending_registration']);

export const borrowerProfiles = pgTable('borrower_profiles', {
  id: serial('id').primaryKey(),
  email: text('email'),
  phone: text('phone'),
  name: text('name').notNull(),
  status: borrowerStatuses('status').notNull().default('unregistered'),
  userId: serial('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const loans = pgTable('loans', {
  id: serial('id').primaryKey(),
  type: loanTypes('type').notNull(),
  status: loanStatuses('status').notNull().default('active'),
  principalAmount: numeric('principal_amount', { precision: 10, scale: 2 }).notNull(),
  interestRate: numeric('interest_rate', { precision: 5, scale: 2 }),
  startDate: date('start_date').notNull(),
  dueDate: date('due_date'),
  description: text('description'),
  lenderId: serial('lender_id').references(() => users.id),
  borrowerId: serial('borrower_id').references(() => users.id),
  borrowerProfileId: serial('borrower_profile_id').references(() => borrowerProfiles.id),
  walletAccountId: serial('wallet_account_id').references(() => walletAccounts.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const loanShareTypes = pgEnum('loan_share_types', ['view', 'edit']);

export const loanShares = pgTable('loan_shares', {
  id: serial('id').primaryKey(),
  loanId: serial('loan_id').references(() => loans.id),
  userId: serial('user_id').references(() => users.id),
  type: loanShareTypes('type').notNull().default('view'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const loanPayments = pgTable('loan_payments', {
  id: serial('id').primaryKey(),
  loanId: serial('loan_id').references(() => loans.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  paymentDate: date('payment_date').notNull(),
  isInterestPayment: boolean('is_interest_payment').notNull().default(false),
  note: text('note'),
  walletTransactionId: serial('wallet_transaction_id').references(() => walletTransactions.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
