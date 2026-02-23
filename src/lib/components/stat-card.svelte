<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { cn, formatCurrency } from "$lib/utils.js";
	import type { Component } from "svelte";

	let {
		title,
		value,
		subtitle = "",
		icon: Icon,
		trend,
		isCurrency = true,
		class: className,
	}: {
		title: string;
		value: number;
		subtitle?: string;
		icon?: Component;
		trend?: "up" | "down" | "neutral";
		isCurrency?: boolean;
		class?: string;
	} = $props();

	const displayValue = $derived(isCurrency ? formatCurrency(value) : `${value}%`);
	const trendColor = $derived(
		trend === "up" ? "text-success" : trend === "down" ? "text-danger" : "text-muted-foreground"
	);
</script>

<Card.Root class={cn("", className)}>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<Card.Title>{title}</Card.Title>
		{#if Icon}
			<Icon class="h-4 w-4 text-muted-foreground" />
		{/if}
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-semibold">{displayValue}</div>
		{#if subtitle}
			<p class={cn("mt-1 text-xs", trendColor)}>{subtitle}</p>
		{/if}
	</Card.Content>
</Card.Root>
