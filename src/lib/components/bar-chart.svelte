<script lang="ts">
	import { formatCurrency } from "$lib/utils.js";

	let {
		data,
		height = 200,
	}: {
		data: {
			label: string;
			value: number;
			color?: string;
			secondaryValue?: number;
			secondaryColor?: string;
		}[];
		height?: number;
	} = $props();

	const maxValue = $derived(
		Math.max(...data.flatMap((d) => [d.value, d.secondaryValue || 0]), 1)
	);
</script>

<div class="w-full">
	<div class="flex items-end gap-2" style="height: {height}px">
		{#each data as item}
			<div class="flex flex-1 flex-col items-center gap-1">
				<div class="flex w-full items-end justify-center gap-0.5" style="height: {height - 24}px">
					<!-- Primary bar -->
					<div
						class="w-full max-w-[24px] rounded-t transition-all duration-300"
						style="height: {(item.value / maxValue) * 100}%; background-color: {item.color ||
							'hsl(var(--foreground) / 0.8)'}"
						title={formatCurrency(item.value)}
					></div>
					{#if item.secondaryValue !== undefined}
						<!-- Secondary bar -->
						<div
							class="w-full max-w-[24px] rounded-t transition-all duration-300"
							style="height: {(item.secondaryValue / maxValue) * 100}%; background-color: {item.secondaryColor ||
								'hsl(var(--foreground) / 0.2)'}"
							title={formatCurrency(item.secondaryValue)}
						></div>
					{/if}
				</div>
				<span class="text-[10px] text-muted-foreground">{item.label}</span>
			</div>
		{/each}
	</div>
</div>
