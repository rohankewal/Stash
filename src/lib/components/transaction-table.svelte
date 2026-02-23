<script lang="ts">
	import * as Table from "$lib/components/ui/table/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import CategoryBadge from "./category-badge.svelte";
	import { formatCurrency, formatDate } from "$lib/utils.js";
	import { finance } from "$lib/stores/index.js";
	import type { Transaction } from "$lib/types.js";
	import Pencil from "lucide-svelte/icons/pencil";
	import Trash2 from "lucide-svelte/icons/trash-2";

	let {
		transactions,
		showActions = false,
		onEdit,
		onDelete,
	}: {
		transactions: Transaction[];
		showActions?: boolean;
		onEdit?: (id: string) => void;
		onDelete?: (id: string) => void;
	} = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Date</Table.Head>
			<Table.Head>Description</Table.Head>
			<Table.Head>Category</Table.Head>
			<Table.Head>Account</Table.Head>
			<Table.Head class="text-right">Amount</Table.Head>
			{#if showActions}
				<Table.Head class="w-[80px]"></Table.Head>
			{/if}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each transactions as tx (tx.id)}
			{@const category = finance.getCategoryById(tx.categoryId)}
			{@const account = finance.getAccountById(tx.accountId)}
			<Table.Row>
				<Table.Cell class="text-muted-foreground">{formatDate(tx.date)}</Table.Cell>
				<Table.Cell class="font-medium">{tx.description}</Table.Cell>
				<Table.Cell>
					{#if category}
						<CategoryBadge name={category.name} color={category.color} />
					{/if}
				</Table.Cell>
				<Table.Cell class="text-muted-foreground">{account?.name || ""}</Table.Cell>
				<Table.Cell
					class="text-right font-medium {tx.type === 'income'
						? 'text-success'
						: 'text-foreground'}"
				>
					{tx.type === "income" ? "+" : "-"}{formatCurrency(Math.abs(tx.amount))}
				</Table.Cell>
				{#if showActions}
					<Table.Cell>
						<div class="flex items-center gap-1">
							{#if onEdit}
								<Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => onEdit(tx.id)}>
									<Pencil class="h-3.5 w-3.5" />
								</Button>
							{/if}
							{#if onDelete}
								<Button
									variant="ghost"
									size="icon"
									class="h-8 w-8 text-muted-foreground hover:text-destructive"
									onclick={() => onDelete(tx.id)}
								>
									<Trash2 class="h-3.5 w-3.5" />
								</Button>
							{/if}
						</div>
					</Table.Cell>
				{/if}
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
