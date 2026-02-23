export type TransactionType = "income" | "expense" | "transfer";

export type AccountType =
	| "checking"
	| "savings"
	| "credit_card"
	| "investment"
	| "cash";

export interface Category {
	id: string;
	name: string;
	type: TransactionType;
	color: string;
}

export interface Account {
	id: string;
	name: string;
	type: AccountType;
	balance: number;
	currency: string;
}

export interface Transaction {
	id: string;
	date: string;
	description: string;
	amount: number;
	type: TransactionType;
	categoryId: string;
	accountId: string;
	notes?: string;
}

export interface Budget {
	id: string;
	categoryId: string;
	allocated: number;
	period: string;
}
