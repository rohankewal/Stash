<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import Input from "$lib/components/ui/input/input.svelte";
	import { Select } from "$lib/components/ui/select/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { finance } from "$lib/stores/index.js";
	import type { Transaction, TransactionType } from "$lib/types.js";

	let {
		open = $bindable(false),
		transaction,
	}: {
		open?: boolean;
		transaction: Transaction | null;
	} = $props();

	let description = $state("");
	let amount = $state("");
	let type = $state<TransactionType>("expense");
	let categoryId = $state("");
	let accountId = $state("");
	let date = $state("");
	let notes = $state("");

	$effect(() => {
		if (transaction) {
			description = transaction.description;
			amount = (transaction.amount / 100).toFixed(2);
			type = transaction.type;
			categoryId = transaction.categoryId;
			accountId = transaction.accountId;
			date = transaction.date;
			notes = transaction.notes || "";
		}
	});

	const filteredCategories = $derived(
		finance.categories.filter((c) => c.type === type)
	);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!transaction) return;
		const cents = Math.round(parseFloat(amount) * 100);
		if (!description || !cents || !categoryId || !accountId) return;

		finance.updateTransaction(transaction.id, {
			date,
			description,
			amount: cents,
			type,
			categoryId,
			accountId,
			notes: notes || undefined,
		});

		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit Transaction</Dialog.Title>
			<Dialog.Description>Update the transaction details.</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="space-y-2">
				<Label for="edit-desc">Description</Label>
				<Input id="edit-desc" bind:value={description} placeholder="e.g., Grocery store" required />
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="edit-amount">Amount ($)</Label>
					<Input
						id="edit-amount"
						type="number"
						step="0.01"
						min="0.01"
						bind:value={amount}
						placeholder="0.00"
						required
					/>
				</div>
				<div class="space-y-2">
					<Label for="edit-type">Type</Label>
					<Select id="edit-type" bind:value={type}>
						<option value="expense">Expense</option>
						<option value="income">Income</option>
						<option value="transfer">Transfer</option>
					</Select>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="edit-category">Category</Label>
					<Select id="edit-category" bind:value={categoryId} required>
						<option value="" disabled>Select...</option>
						{#each filteredCategories as cat}
							<option value={cat.id}>{cat.name}</option>
						{/each}
					</Select>
				</div>
				<div class="space-y-2">
					<Label for="edit-account">Account</Label>
					<Select id="edit-account" bind:value={accountId} required>
						<option value="" disabled>Select...</option>
						{#each finance.accounts as acc}
							<option value={acc.id}>{acc.name}</option>
						{/each}
					</Select>
				</div>
			</div>
			<div class="space-y-2">
				<Label for="edit-date">Date</Label>
				<Input id="edit-date" type="date" bind:value={date} required />
			</div>
			<div class="space-y-2">
				<Label for="edit-notes">Notes (optional)</Label>
				<Input id="edit-notes" bind:value={notes} placeholder="Additional notes..." />
			</div>
			<Dialog.Footer>
				<Button variant="outline" type="button" onclick={() => (open = false)}>Cancel</Button>
				<Button type="submit">Save Changes</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
