<script lang="ts">
	import { formatCurrency } from "$lib/utils.js";
	import type { Category } from "$lib/types.js";

	let {
		items,
	}: {
		items: { category: Category | undefined; total: number }[];
	} = $props();

	const maxTotal = $derived(Math.max(...items.map((i) => i.total), 1));
</script>

<div class="space-y-3">
	{#each items as item}
		{@const color = item.category?.color || "#a1a1aa"}
		<div class="space-y-1.5">
			<div class="flex items-center justify-between text-sm">
				<div class="flex items-center gap-2">
					<div
						class="h-2.5 w-2.5 shrink-0 rounded-full"
						style="background-color: {color}"
					></div>
					<span class="font-medium">{item.category?.name || "Unknown"}</span>
				</div>
				<span class="text-muted-foreground">{formatCurrency(item.total)}</span>
			</div>
			<div class="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
				<div
					class="h-full rounded-full transition-all duration-300"
					style="width: {(item.total / maxTotal) * 100}%; background-color: {color}"
				></div>
			</div>
		</div>
	{/each}
</div>
