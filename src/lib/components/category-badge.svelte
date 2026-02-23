<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index.js";

	let { name, color }: { name: string; color?: string } = $props();
</script>

<Badge variant="outline" class="font-normal gap-1.5">
	{#if color}
		<div class="h-2 w-2 shrink-0 rounded-full" style="background-color: {color}"></div>
	{/if}
	{name}
</Badge>
