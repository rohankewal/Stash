<script lang="ts">
	import PageHeader from "$lib/components/page-header.svelte";
	import TransactionTable from "$lib/components/transaction-table.svelte";
	import AddTransactionForm from "$lib/components/add-transaction-form.svelte";
	import EditTransactionForm from "$lib/components/edit-transaction-form.svelte";
	import ConfirmDialog from "$lib/components/confirm-dialog.svelte";
	import EmptyState from "$lib/components/empty-state.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import Input from "$lib/components/ui/input/input.svelte";
	import { Select } from "$lib/components/ui/select/index.js";
	import { finance } from "$lib/stores/index.js";
	import type { Transaction } from "$lib/types.js";
	import Plus from "lucide-svelte/icons/plus";
	import ArrowLeftRight from "lucide-svelte/icons/arrow-left-right";
	import Search from "lucide-svelte/icons/search";

	let addOpen = $state(false);
	let editOpen = $state(false);
	let deleteOpen = $state(false);
	let editingTransaction = $state<Transaction | null>(null);
	let deletingId = $state<string | null>(null);

	let searchQuery = $state("");
	let typeFilter = $state("all");
	let categoryFilter = $state("all");

	const filteredTransactions = $derived.by(() => {
		let txs = [...finance.transactions].sort((a, b) => b.date.localeCompare(a.date));

		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			txs = txs.filter(
				(t) =>
					t.description.toLowerCase().includes(q) ||
					(t.notes && t.notes.toLowerCase().includes(q))
			);
		}

		if (typeFilter !== "all") {
			txs = txs.filter((t) => t.type === typeFilter);
		}

		if (categoryFilter !== "all") {
			txs = txs.filter((t) => t.categoryId === categoryFilter);
		}

		return txs;
	});

	function handleEdit(id: string) {
		editingTransaction = finance.transactions.find((t) => t.id === id) || null;
		if (editingTransaction) editOpen = true;
	}

	function handleDelete(id: string) {
		deletingId = id;
		deleteOpen = true;
	}

	function confirmDelete() {
		if (deletingId) {
			finance.deleteTransaction(deletingId);
			deletingId = null;
		}
	}
</script>

<svelte:head>
	<title>Transactions - Stash</title>
</svelte:head>

<PageHeader title="Transactions" description="Manage all your transactions.">
	{#snippet actions()}
		<Button onclick={() => (addOpen = true)}>
			<Plus class="h-4 w-4" />
			Add Transaction
		</Button>
	{/snippet}
</PageHeader>

<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
	<div class="relative flex-1">
		<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
		<Input
			bind:value={searchQuery}
			placeholder="Search transactions..."
			class="pl-9"
		/>
	</div>
	<div class="flex gap-2">
		<Select bind:value={typeFilter} class="w-[140px]">
			<option value="all">All Types</option>
			<option value="income">Income</option>
			<option value="expense">Expense</option>
			<option value="transfer">Transfer</option>
		</Select>
		<Select bind:value={categoryFilter} class="w-[160px]">
			<option value="all">All Categories</option>
			{#each finance.categories as cat}
				<option value={cat.id}>{cat.name}</option>
			{/each}
		</Select>
	</div>
</div>

{#if filteredTransactions.length > 0}
	<TransactionTable
		transactions={filteredTransactions}
		showActions
		onEdit={handleEdit}
		onDelete={handleDelete}
	/>
{:else}
	<EmptyState
		icon={ArrowLeftRight}
		title="No transactions found"
		description={searchQuery || typeFilter !== "all" || categoryFilter !== "all"
			? "Try adjusting your filters."
			: "Add your first transaction to get started."}
	>
		{#snippet actions()}
			{#if !searchQuery && typeFilter === "all" && categoryFilter === "all"}
				<Button onclick={() => (addOpen = true)}>
					<Plus class="h-4 w-4" />
					Add Transaction
				</Button>
			{/if}
		{/snippet}
	</EmptyState>
{/if}

<AddTransactionForm bind:open={addOpen} />
<EditTransactionForm bind:open={editOpen} transaction={editingTransaction} />
<ConfirmDialog
	bind:open={deleteOpen}
	title="Delete Transaction"
	description="Are you sure you want to delete this transaction? This will also adjust your account balance."
	onConfirm={confirmDelete}
/>
