<script lang="ts">
	import type { WithElementRef, WithoutChildren } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		value = 0,
		max = 100,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLAttributes<HTMLDivElement>>> & {
		value?: number;
		max?: number;
	} = $props();

	const percentage = $derived(Math.min(100, Math.max(0, (value / max) * 100)));
</script>

<div
	bind:this={ref}
	class={cn("bg-secondary relative h-2 w-full overflow-hidden rounded-full", className)}
	role="progressbar"
	aria-valuenow={value}
	aria-valuemin={0}
	aria-valuemax={max}
	{...restProps}
>
	<div
		class="bg-primary h-full transition-all duration-300"
		style="width: {percentage}%"
	></div>
</div>
