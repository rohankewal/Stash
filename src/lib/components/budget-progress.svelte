<script lang="ts">
	import { formatCurrency, cn } from "$lib/utils.js";

	let {
		categoryName,
		allocated,
		spent,
		percentage,
		color = "#a1a1aa",
	}: {
		categoryName: string;
		allocated: number;
		spent: number;
		percentage: number;
		color?: string;
	} = $props();

	const isOverBudget = $derived(percentage >= 90);
	const barColor = $derived(isOverBudget ? "hsl(0 72% 51%)" : color);
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between text-sm">
		<div class="flex items-center gap-2">
			<div
				class="h-2.5 w-2.5 shrink-0 rounded-full"
				style="background-color: {color}"
			></div>
			<span class="font-medium">{categoryName}</span>
		</div>
		<span class="text-muted-foreground">
			{formatCurrency(spent)} / {formatCurrency(allocated)}
		</span>
	</div>
	<div class="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
		<div
			class="h-full rounded-full transition-all duration-300"
			style="width: {percentage}%; background-color: {barColor}"
		></div>
	</div>
	<div class="flex items-center justify-between text-xs text-muted-foreground">
		<span>{percentage}% used</span>
		<span
			class={cn(
				spent > allocated ? "text-danger" : "text-muted-foreground"
			)}
		>
			{spent > allocated
				? `${formatCurrency(spent - allocated)} over`
				: `${formatCurrency(allocated - spent)} remaining`}
		</span>
	</div>
</div>
