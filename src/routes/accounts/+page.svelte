<script lang="ts">
	import PageHeader from "$lib/components/page-header.svelte";
	import AccountCard from "$lib/components/account-card.svelte";
	import EmptyState from "$lib/components/empty-state.svelte";
	import ConfirmDialog from "$lib/components/confirm-dialog.svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import Input from "$lib/components/ui/input/input.svelte";
	import { Select } from "$lib/components/ui/select/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { finance } from "$lib/stores/index.js";
	import { formatCurrency, generateId } from "$lib/utils.js";
	import type { AccountType } from "$lib/types.js";
	import Plus from "lucide-svelte/icons/plus";
	import Wallet from "lucide-svelte/icons/wallet";

	let addOpen = $state(false);
	let deleteOpen = $state(false);
	let deletingId = $state<string | null>(null);

	let newName = $state("");
	let newType = $state<AccountType>("checking");
	let newBalance = $state("");

	const netWorth = $derived(finance.accounts.reduce((sum, a) => sum + a.balance, 0));

	function handleAddAccount(e: SubmitEvent) {
		e.preventDefault();
		const cents = Math.round(parseFloat(newBalance) * 100);
		if (!newName) return;

		finance.addAccount({
			id: generateId(),
			name: newName,
			type: newType,
			balance: cents || 0,
			currency: "USD",
		});

		newName = "";
		newType = "checking";
		newBalance = "";
		addOpen = false;
	}

	function handleDelete(id: string) {
		deletingId = id;
		deleteOpen = true;
	}

	function confirmDelete() {
		if (deletingId) {
			finance.deleteAccount(deletingId);
			deletingId = null;
		}
	}
</script>

<svelte:head>
	<title>Accounts - Stash</title>
</svelte:head>

<PageHeader title="Accounts" description="Manage your financial accounts.">
	{#snippet actions()}
		<Button onclick={() => (addOpen = true)}>
			<Plus class="h-4 w-4" />
			Add Account
		</Button>
	{/snippet}
</PageHeader>

{#if finance.accounts.length > 0}
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each finance.accounts as account (account.id)}
			<AccountCard {account} onDelete={handleDelete} />
		{/each}
	</div>

	<Card.Root class="mt-6">
		<Card.Header class="pb-2">
			<Card.Title>Net Worth</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="text-3xl font-semibold">{formatCurrency(netWorth)}</div>
			<p class="mt-1 text-xs text-muted-foreground">Total across all accounts</p>
		</Card.Content>
	</Card.Root>
{:else}
	<EmptyState
		icon={Wallet}
		title="No accounts"
		description="Add your bank accounts, credit cards, and other financial accounts."
	>
		{#snippet actions()}
			<Button onclick={() => (addOpen = true)}>
				<Plus class="h-4 w-4" />
				Add Account
			</Button>
		{/snippet}
	</EmptyState>
{/if}

<Dialog.Root bind:open={addOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add Account</Dialog.Title>
			<Dialog.Description>Add a new financial account to track.</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={handleAddAccount} class="space-y-4">
			<div class="space-y-2">
				<Label for="acc-name">Account Name</Label>
				<Input id="acc-name" bind:value={newName} placeholder="e.g., Main Checking" required />
			</div>
			<div class="space-y-2">
				<Label for="acc-type">Account Type</Label>
				<Select id="acc-type" bind:value={newType}>
					<option value="checking">Checking</option>
					<option value="savings">Savings</option>
					<option value="credit_card">Credit Card</option>
					<option value="investment">Investment</option>
					<option value="cash">Cash</option>
				</Select>
			</div>
			<div class="space-y-2">
				<Label for="acc-balance">Current Balance ($)</Label>
				<Input
					id="acc-balance"
					type="number"
					step="0.01"
					bind:value={newBalance}
					placeholder="0.00"
				/>
			</div>
			<Dialog.Footer>
				<Button variant="outline" type="button" onclick={() => (addOpen = false)}>Cancel</Button>
				<Button type="submit">Add Account</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<ConfirmDialog
	bind:open={deleteOpen}
	title="Delete Account"
	description="Are you sure you want to delete this account? Transactions linked to this account will remain."
	onConfirm={confirmDelete}
/>
