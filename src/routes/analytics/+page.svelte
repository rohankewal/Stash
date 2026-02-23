<script lang="ts">
	import PageHeader from "$lib/components/page-header.svelte";
	import BarChart from "$lib/components/bar-chart.svelte";
	import SpendingList from "$lib/components/spending-list.svelte";
	import StatCard from "$lib/components/stat-card.svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import { finance } from "$lib/stores/index.js";
	import { formatCurrency } from "$lib/utils.js";
	import TrendingUp from "lucide-svelte/icons/trending-up";
	import TrendingDown from "lucide-svelte/icons/trending-down";
	import DollarSign from "lucide-svelte/icons/dollar-sign";

	const trends = $derived(finance.getMonthlyTrends(6));
	const categoryBreakdown = $derived(finance.getCategoryBreakdown());

	const chartData = $derived(
		trends.map((t) => {
			const monthDate = new Date(t.month + "-01T00:00:00");
			return {
				label: monthDate.toLocaleDateString("en-US", { month: "short" }),
				value: t.income,
				color: "#22c55e",
				secondaryValue: t.expenses,
				secondaryColor: "#ef4444",
			};
		})
	);

	const categoryChartData = $derived(
		categoryBreakdown.map((item) => ({
			label: item.category?.name || "?",
			value: item.total,
			color: item.category?.color || "#a1a1aa",
		}))
	);

	const netCashFlow = $derived(finance.monthlyIncome - finance.monthlyExpenses);
</script>

<svelte:head>
	<title>Analytics - Stash</title>
</svelte:head>

<PageHeader title="Analytics" description="Insights into your spending and earning patterns." />

<Tabs.Root value="trends">
	<Tabs.List>
		<Tabs.Trigger value="trends">Monthly Trends</Tabs.Trigger>
		<Tabs.Trigger value="categories">Categories</Tabs.Trigger>
		<Tabs.Trigger value="summary">Summary</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="trends">
		<Card.Root class="mt-4">
			<Card.Header>
				<Card.Title class="text-base">Income vs Expenses</Card.Title>
				<Card.Description>Last 6 months comparison</Card.Description>
			</Card.Header>
			<Card.Content>
				{#if trends.some((t) => t.income > 0 || t.expenses > 0)}
					<BarChart data={chartData} height={220} />
					<div class="mt-4 flex items-center gap-6 text-xs text-muted-foreground">
						<div class="flex items-center gap-1.5">
							<div class="h-2.5 w-2.5 rounded-sm" style="background-color: #22c55e"></div>
							Income
						</div>
						<div class="flex items-center gap-1.5">
							<div class="h-2.5 w-2.5 rounded-sm" style="background-color: #ef4444"></div>
							Expenses
						</div>
					</div>
				{:else}
					<p class="py-12 text-center text-sm text-muted-foreground">
						Not enough data to display trends.
					</p>
				{/if}
			</Card.Content>
		</Card.Root>

		<div class="mt-4 grid gap-4 sm:grid-cols-3">
			{#each trends.slice(-3) as t}
				{@const monthDate = new Date(t.month + "-01T00:00:00")}
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title>
							{monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="space-y-1 text-sm">
							<div class="flex justify-between">
								<span class="text-muted-foreground">Income</span>
								<span class="text-success">{formatCurrency(t.income)}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-muted-foreground">Expenses</span>
								<span>{formatCurrency(t.expenses)}</span>
							</div>
							<div class="border-t pt-1 flex justify-between font-medium">
								<span>Net</span>
								<span class={t.income - t.expenses >= 0 ? "text-success" : "text-danger"}>
									{formatCurrency(t.income - t.expenses)}
								</span>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</Tabs.Content>

	<Tabs.Content value="categories">
		{#if categoryBreakdown.length > 0}
			<Card.Root class="mt-4">
				<Card.Header>
					<Card.Title class="text-base">Category Breakdown</Card.Title>
					<Card.Description>Current month spending by category</Card.Description>
				</Card.Header>
				<Card.Content>
					<BarChart data={categoryChartData} height={200} />
				</Card.Content>
			</Card.Root>

			<Card.Root class="mt-4">
				<Card.Header>
					<Card.Title class="text-base">Spending by Category</Card.Title>
				</Card.Header>
				<Card.Content>
					<SpendingList items={categoryBreakdown} />
					<div class="mt-6 border-t pt-4">
						<div class="flex items-center justify-between text-sm font-medium">
							<span>Total Expenses</span>
							<span>{formatCurrency(finance.monthlyExpenses)}</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{:else}
			<Card.Root class="mt-4">
				<Card.Content>
					<p class="py-12 text-center text-sm text-muted-foreground">
						No expenses this month.
					</p>
				</Card.Content>
			</Card.Root>
		{/if}
	</Tabs.Content>

	<Tabs.Content value="summary">
		<div class="mt-4 grid gap-4 sm:grid-cols-3">
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
				title="Net Cash Flow"
				value={netCashFlow}
				icon={DollarSign}
				subtitle={netCashFlow >= 0 ? "Positive" : "Negative"}
				trend={netCashFlow >= 0 ? "up" : "down"}
			/>
		</div>

		<Card.Root class="mt-4">
			<Card.Header>
				<Card.Title class="text-base">Monthly Breakdown</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="space-y-3">
					{#each trends as t}
						{@const monthDate = new Date(t.month + "-01T00:00:00")}
						{@const net = t.income - t.expenses}
						<div class="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
							<span class="text-sm font-medium">
								{monthDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
							</span>
							<div class="flex items-center gap-6 text-sm">
								<span class="text-success">+{formatCurrency(t.income)}</span>
								<span class="text-muted-foreground">-{formatCurrency(t.expenses)}</span>
								<span class="font-medium {net >= 0 ? 'text-success' : 'text-danger'}">
									{formatCurrency(net)}
								</span>
							</div>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
