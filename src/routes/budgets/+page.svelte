<script lang="ts">
	import PageHeader from "$lib/components/page-header.svelte";
	import BudgetProgress from "$lib/components/budget-progress.svelte";
	import EmptyState from "$lib/components/empty-state.svelte";
	import ConfirmDialog from "$lib/components/confirm-dialog.svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import Input from "$lib/components/ui/input/input.svelte";
	import { Select } from "$lib/components/ui/select/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { finance } from "$lib/stores/index.js";
	import { formatCurrency, generateId, getCurrentMonth } from "$lib/utils.js";
	import Plus from "lucide-svelte/icons/plus";
	import PiggyBank from "lucide-svelte/icons/piggy-bank";
	import Trash2 from "lucide-svelte/icons/trash-2";

	let addOpen = $state(false);
	let deleteOpen = $state(false);
	let deletingId = $state<string | null>(null);

	let newCategoryId = $state("");
	let newAllocated = $state("");

	const currentMonth = getCurrentMonth();

	const totalBudgeted = $derived(
		finance.budgetProgress.reduce((sum, b) => sum + b.budget.allocated, 0)
	);
	const totalSpent = $derived(
		finance.budgetProgress.reduce((sum, b) => sum + b.spent, 0)
	);

	const expenseCategories = $derived(
		finance.categories.filter((c) => c.type === "expense")
	);

	const budgetedCategoryIds = $derived(
		new Set(finance.budgets.filter((b) => b.period === currentMonth).map((b) => b.categoryId))
	);

	const availableCategories = $derived(
		expenseCategories.filter((c) => !budgetedCategoryIds.has(c.id))
	);

	function handleAddBudget(e: SubmitEvent) {
		e.preventDefault();
		const cents = Math.round(parseFloat(newAllocated) * 100);
		if (!newCategoryId || !cents) return;

		finance.addBudget({
			id: generateId(),
			categoryId: newCategoryId,
			allocated: cents,
			period: currentMonth,
		});

		newCategoryId = "";
		newAllocated = "";
		addOpen = false;
	}

	function handleDelete(id: string) {
		deletingId = id;
		deleteOpen = true;
	}

	function confirmDelete() {
		if (deletingId) {
			finance.deleteBudget(deletingId);
			deletingId = null;
		}
	}
</script>

<svelte:head>
	<title>Budgets - Stash</title>
</svelte:head>

<PageHeader title="Budgets" description="Track your monthly spending limits.">
	{#snippet actions()}
		{#if availableCategories.length > 0}
			<Button onclick={() => (addOpen = true)}>
				<Plus class="h-4 w-4" />
				Add Budget
			</Button>
		{/if}
	{/snippet}
</PageHeader>

{#if finance.budgetProgress.length > 0}
	<div class="grid gap-4 sm:grid-cols-2 mb-6">
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title>Total Budgeted</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-semibold">{formatCurrency(totalBudgeted)}</div>
				<p class="mt-1 text-xs text-muted-foreground">This month</p>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title>Total Spent</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="text-2xl font-semibold">{formatCurrency(totalSpent)}</div>
				<p class="mt-1 text-xs text-muted-foreground">
					{formatCurrency(totalBudgeted - totalSpent)} remaining
				</p>
			</Card.Content>
		</Card.Root>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title class="text-base">Budget Categories</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-6">
			{#each finance.budgetProgress as bp}
				<div class="flex items-start gap-4">
					<div class="flex-1">
						<BudgetProgress
							categoryName={bp.category?.name || "Unknown"}
							allocated={bp.budget.allocated}
							spent={bp.spent}
							percentage={bp.percentage}
							color={bp.category?.color}
						/>
					</div>
					<Button
						variant="ghost"
						size="icon"
						class="mt-0.5 h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
						onclick={() => handleDelete(bp.budget.id)}
					>
						<Trash2 class="h-3.5 w-3.5" />
					</Button>
				</div>
			{/each}
		</Card.Content>
	</Card.Root>
{:else}
	<EmptyState
		icon={PiggyBank}
		title="No budgets set"
		description="Create budget limits to track your spending."
	>
		{#snippet actions()}
			<Button onclick={() => (addOpen = true)}>
				<Plus class="h-4 w-4" />
				Add Budget
			</Button>
		{/snippet}
	</EmptyState>
{/if}

<Dialog.Root bind:open={addOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add Budget</Dialog.Title>
			<Dialog.Description>Set a monthly spending limit for a category.</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={handleAddBudget} class="space-y-4">
			<div class="space-y-2">
				<Label for="bud-cat">Category</Label>
				<Select id="bud-cat" bind:value={newCategoryId} required>
					<option value="" disabled>Select category...</option>
					{#each availableCategories as cat}
						<option value={cat.id}>{cat.name}</option>
					{/each}
				</Select>
			</div>
			<div class="space-y-2">
				<Label for="bud-amount">Monthly Limit ($)</Label>
				<Input
					id="bud-amount"
					type="number"
					step="0.01"
					min="0.01"
					bind:value={newAllocated}
					placeholder="0.00"
					required
				/>
			</div>
			<Dialog.Footer>
				<Button variant="outline" type="button" onclick={() => (addOpen = false)}>Cancel</Button>
				<Button type="submit">Add Budget</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<ConfirmDialog
	bind:open={deleteOpen}
	title="Delete Budget"
	description="Are you sure you want to remove this budget category?"
	onConfirm={confirmDelete}
/>
