import type { Transaction, Account, Budget, Category } from "$lib/types.js";
import { getCurrentMonth } from "$lib/utils.js";

const STORAGE_KEY = "stash-finance-data";

interface FinanceData {
	transactions: Transaction[];
	accounts: Account[];
	budgets: Budget[];
	categories: Category[];
}

class FinanceStore {
	transactions = $state<Transaction[]>([]);
	accounts = $state<Account[]>([]);
	budgets = $state<Budget[]>([]);
	categories = $state<Category[]>([]);

	totalBalance = $derived(this.accounts.reduce((sum, a) => sum + a.balance, 0));

	currentMonthTransactions = $derived.by(() => {
		const month = getCurrentMonth();
		return this.transactions.filter((t) => t.date.startsWith(month));
	});

	monthlyIncome = $derived(
		this.currentMonthTransactions
			.filter((t) => t.type === "income")
			.reduce((sum, t) => sum + t.amount, 0)
	);

	monthlyExpenses = $derived(
		this.currentMonthTransactions
			.filter((t) => t.type === "expense")
			.reduce((sum, t) => sum + Math.abs(t.amount), 0)
	);

	savingsRate = $derived.by(() => {
		if (this.monthlyIncome === 0) return 0;
		return Math.round(
			((this.monthlyIncome - this.monthlyExpenses) / this.monthlyIncome) * 100
		);
	});

	recentTransactions = $derived(
		[...this.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10)
	);

	spendingByCategory = $derived.by(() => {
		const map = new Map<string, number>();
		for (const t of this.currentMonthTransactions) {
			if (t.type === "expense") {
				const current = map.get(t.categoryId) || 0;
				map.set(t.categoryId, current + Math.abs(t.amount));
			}
		}
		return map;
	});

	budgetProgress = $derived.by(() => {
		const month = getCurrentMonth();
		const currentBudgets = this.budgets.filter((b) => b.period === month);
		return currentBudgets.map((budget) => {
			const spent = this.spendingByCategory.get(budget.categoryId) || 0;
			const category = this.categories.find((c) => c.id === budget.categoryId);
			return {
				budget,
				category,
				spent,
				remaining: budget.allocated - spent,
				percentage:
					budget.allocated > 0
						? Math.min(Math.round((spent / budget.allocated) * 100), 100)
						: 0,
			};
		});
	});

	addTransaction(t: Transaction) {
		this.transactions = [...this.transactions, t];
		const account = this.accounts.find((a) => a.id === t.accountId);
		if (account) {
			if (t.type === "income") {
				account.balance += t.amount;
			} else if (t.type === "expense") {
				account.balance -= Math.abs(t.amount);
			}
		}
		this.persist();
	}

	updateTransaction(id: string, updates: Partial<Transaction>) {
		this.transactions = this.transactions.map((t) =>
			t.id === id ? { ...t, ...updates } : t
		);
		this.persist();
	}

	deleteTransaction(id: string) {
		const t = this.transactions.find((tx) => tx.id === id);
		if (t) {
			const account = this.accounts.find((a) => a.id === t.accountId);
			if (account) {
				if (t.type === "income") {
					account.balance -= t.amount;
				} else if (t.type === "expense") {
					account.balance += Math.abs(t.amount);
				}
			}
		}
		this.transactions = this.transactions.filter((tx) => tx.id !== id);
		this.persist();
	}

	addAccount(a: Account) {
		this.accounts = [...this.accounts, a];
		this.persist();
	}

	updateAccount(id: string, updates: Partial<Account>) {
		this.accounts = this.accounts.map((a) => (a.id === id ? { ...a, ...updates } : a));
		this.persist();
	}

	deleteAccount(id: string) {
		this.accounts = this.accounts.filter((a) => a.id !== id);
		this.persist();
	}

	addBudget(b: Budget) {
		this.budgets = [...this.budgets, b];
		this.persist();
	}

	updateBudget(id: string, updates: Partial<Budget>) {
		this.budgets = this.budgets.map((b) => (b.id === id ? { ...b, ...updates } : b));
		this.persist();
	}

	deleteBudget(id: string) {
		this.budgets = this.budgets.filter((b) => b.id !== id);
		this.persist();
	}

	persist() {
		if (typeof window === "undefined") return;
		const data: FinanceData = {
			transactions: this.transactions,
			accounts: this.accounts,
			budgets: this.budgets,
			categories: this.categories,
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	}

	load() {
		if (typeof window === "undefined") return;
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			try {
				const data: FinanceData = JSON.parse(raw);
				this.transactions = data.transactions || [];
				this.accounts = data.accounts || [];
				this.budgets = data.budgets || [];
				// Backfill colors for categories saved before colors were added
			const fallbackColors = [
				"#f97316", "#ef4444", "#3b82f6", "#a855f7",
				"#eab308", "#ec4899", "#14b8a6", "#6366f1",
				"#22c55e", "#10b981",
			];
			this.categories = (data.categories || []).map((c, i) => ({
				...c,
				color: c.color || fallbackColors[i % fallbackColors.length],
			}));
			} catch {
				// Corrupted data, skip
			}
		}
	}

	get hasData(): boolean {
		return this.transactions.length > 0 || this.accounts.length > 0;
	}

	getMonthlyTrends(months: number = 6) {
		const trends: { month: string; income: number; expenses: number }[] = [];
		const now = new Date();
		for (let i = months - 1; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
			const monthTx = this.transactions.filter((t) => t.date.startsWith(monthStr));
			const income = monthTx
				.filter((t) => t.type === "income")
				.reduce((s, t) => s + t.amount, 0);
			const expenses = monthTx
				.filter((t) => t.type === "expense")
				.reduce((s, t) => s + Math.abs(t.amount), 0);
			trends.push({ month: monthStr, income, expenses });
		}
		return trends;
	}

	getCategoryBreakdown(month?: string) {
		const m = month || getCurrentMonth();
		const monthTx = this.transactions.filter(
			(t) => t.date.startsWith(m) && t.type === "expense"
		);
		const map = new Map<string, { category: Category | undefined; total: number }>();
		for (const t of monthTx) {
			const existing = map.get(t.categoryId);
			if (existing) {
				existing.total += Math.abs(t.amount);
			} else {
				map.set(t.categoryId, {
					category: this.categories.find((c) => c.id === t.categoryId),
					total: Math.abs(t.amount),
				});
			}
		}
		return [...map.values()].sort((a, b) => b.total - a.total);
	}

	getCategoryById(id: string): Category | undefined {
		return this.categories.find((c) => c.id === id);
	}

	getAccountById(id: string): Account | undefined {
		return this.accounts.find((a) => a.id === id);
	}
}

export const finance = new FinanceStore();
