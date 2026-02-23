<script lang="ts">
	import PageHeader from "$lib/components/page-header.svelte";
	import StatCard from "$lib/components/stat-card.svelte";
	import TransactionTable from "$lib/components/transaction-table.svelte";
	import SpendingList from "$lib/components/spending-list.svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import { finance } from "$lib/stores/index.js";
	import DollarSign from "lucide-svelte/icons/dollar-sign";
	import TrendingUp from "lucide-svelte/icons/trending-up";
	import TrendingDown from "lucide-svelte/icons/trending-down";
	import Percent from "lucide-svelte/icons/percent";

	const categoryBreakdown = $derived(finance.getCategoryBreakdown());
</script>

<svelte:head>
	<title>Dashboard - Stash</title>
</svelte:head>

<PageHeader title="Dashboard" description="Overview of your financial health." />

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
	<StatCard
		title="Total Balance"
		value={finance.totalBalance}
		icon={DollarSign}
		subtitle="Across all accounts"
		trend="neutral"
	/>
	<StatCard
		title="Monthly Income"
		value={finance.monthlyIncome}
		icon={TrendingUp}
		subtitle="This month"
		trend="up"
	/>
	<StatCard
		title="Monthly Expenses"
		value={finance.monthlyExpenses}
		icon={TrendingDown}
		subtitle="This month"
		trend="down"
	/>
	<StatCard
		title="Savings Rate"
		value={finance.savingsRate}
		icon={Percent}
		isCurrency={false}
		subtitle="Of income saved"
		trend={finance.savingsRate > 0 ? "up" : "down"}
	/>
</div>

<div class="mt-6 grid gap-6 lg:grid-cols-3">
	<Card.Root class="lg:col-span-2">
		<Card.Header>
			<Card.Title class="text-base">Recent Transactions</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if finance.recentTransactions.length > 0}
				<TransactionTable transactions={finance.recentTransactions} />
			{:else}
				<p class="py-8 text-center text-sm text-muted-foreground">No transactions yet.</p>
			{/if}
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title class="text-base">Spending by Category</Card.Title>
		</Card.Header>
		<Card.Content>
			{#if categoryBreakdown.length > 0}
				<SpendingList items={categoryBreakdown} />
			{:else}
				<p class="py-8 text-center text-sm text-muted-foreground">No expenses this month.</p>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
