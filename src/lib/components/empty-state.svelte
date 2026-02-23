<script lang="ts">
	import type { Component, Snippet } from "svelte";

	let {
		icon: Icon,
		title,
		description = "",
		actions,
	}: {
		icon?: Component;
		title: string;
		description?: string;
		actions?: Snippet;
	} = $props();
</script>

<div class="flex flex-col items-center justify-center py-16 text-center">
	{#if Icon}
		<Icon class="mb-4 h-10 w-10 text-muted-foreground/50" />
	{/if}
	<h3 class="text-sm font-medium">{title}</h3>
	{#if description}
		<p class="mt-1 text-sm text-muted-foreground">{description}</p>
	{/if}
	{#if actions}
		<div class="mt-4">
			{@render actions()}
		</div>
	{/if}
</div>
