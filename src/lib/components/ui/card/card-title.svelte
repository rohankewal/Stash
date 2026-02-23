<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLHeadingElement>> & { children?: Snippet } = $props();
</script>

<h3
	bind:this={ref}
	class={cn("text-sm font-medium leading-none tracking-tight", className)}
	{...restProps}
>
	{@render children?.()}
</h3>
