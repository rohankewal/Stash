<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import Input from "$lib/components/ui/input/input.svelte";
	import { Select } from "$lib/components/ui/select/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { finance } from "$lib/stores/index.js";
	import { generateId } from "$lib/utils.js";
	import type { TransactionType } from "$lib/types.js";

	let {
		open = $bindable(false),
	}: {
		open?: boolean;
	} = $props();

	let description = $state("");
	let amount = $state("");
	let type = $state<TransactionType>("expense");
	let categoryId = $state("");
	let accountId = $state("");
	let date = $state(new Date().toISOString().slice(0, 10));
	let notes = $state("");

	const filteredCategories = $derived(
		finance.categories.filter((c) => c.type === type)
	);

	function resetForm() {
		description = "";
		amount = "";
		type = "expense";
		categoryId = "";
		accountId = "";
		date = new Date().toISOString().slice(0, 10);
		notes = "";
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const cents = Math.round(parseFloat(amount) * 100);
		if (!description || !cents || !categoryId || !accountId) return;

		finance.addTransaction({
			id: generateId(),
			date,
			description,
			amount: cents,
			type,
			categoryId,
			accountId,
			notes: notes || undefined,
		});

		resetForm();
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add Transaction</Dialog.Title>
			<Dialog.Description>Enter the details of your transaction.</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={handleSubmit} class="space-y-4">
			<div class="space-y-2">
				<Label for="tx-desc">Description</Label>
				<Input id="tx-desc" bind:value={description} placeholder="e.g., Grocery store" required />
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="tx-amount">Amount ($)</Label>
					<Input
						id="tx-amount"
						type="number"
						step="0.01"
						min="0.01"
						bind:value={amount}
						placeholder="0.00"
						required
					/>
				</div>
				<div class="space-y-2">
					<Label for="tx-type">Type</Label>
					<Select id="tx-type" bind:value={type}>
						<option value="expense">Expense</option>
						<option value="income">Income</option>
						<option value="transfer">Transfer</option>
					</Select>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="tx-category">Category</Label>
					<Select id="tx-category" bind:value={categoryId} required>
						<option value="" disabled>Select...</option>
						{#each filteredCategories as cat}
							<option value={cat.id}>{cat.name}</option>
						{/each}
					</Select>
				</div>
				<div class="space-y-2">
					<Label for="tx-account">Account</Label>
					<Select id="tx-account" bind:value={accountId} required>
						<option value="" disabled>Select...</option>
						{#each finance.accounts as acc}
							<option value={acc.id}>{acc.name}</option>
						{/each}
					</Select>
				</div>
			</div>
			<div class="space-y-2">
				<Label for="tx-date">Date</Label>
				<Input id="tx-date" type="date" bind:value={date} required />
			</div>
			<div class="space-y-2">
				<Label for="tx-notes">Notes (optional)</Label>
				<Input id="tx-notes" bind:value={notes} placeholder="Additional notes..." />
			</div>
			<Dialog.Footer>
				<Button variant="outline" type="button" onclick={() => (open = false)}>Cancel</Button>
				<Button type="submit">Add Transaction</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
