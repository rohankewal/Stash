<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { formatCurrency, cn } from "$lib/utils.js";
	import type { Account } from "$lib/types.js";
	import Trash2 from "lucide-svelte/icons/trash-2";
	import Landmark from "lucide-svelte/icons/landmark";
	import PiggyBank from "lucide-svelte/icons/piggy-bank";
	import CreditCard from "lucide-svelte/icons/credit-card";
	import TrendingUp from "lucide-svelte/icons/trending-up";
	import Banknote from "lucide-svelte/icons/banknote";

	let {
		account,
		onDelete,
	}: {
		account: Account;
		onDelete?: (id: string) => void;
	} = $props();

	const typeIcons: Record<string, typeof Landmark> = {
		checking: Landmark,
		savings: PiggyBank,
		credit_card: CreditCard,
		investment: TrendingUp,
		cash: Banknote,
	};

	const typeLabels: Record<string, string> = {
		checking: "Checking",
		savings: "Savings",
		credit_card: "Credit Card",
		investment: "Investment",
		cash: "Cash",
	};

	const Icon = $derived(typeIcons[account.type] || Landmark);
</script>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
		<div class="flex items-center gap-2">
			<Icon class="h-4 w-4 text-muted-foreground" />
			<Card.Title>{account.name}</Card.Title>
		</div>
		<div class="flex items-center gap-1">
			<Badge variant="outline" class="text-xs font-normal">
				{typeLabels[account.type] || account.type}
			</Badge>
			{#if onDelete}
				<Button
					variant="ghost"
					size="icon"
					class="h-7 w-7 text-muted-foreground hover:text-destructive"
					onclick={() => onDelete(account.id)}
				>
					<Trash2 class="h-3.5 w-3.5" />
				</Button>
			{/if}
		</div>
	</Card.Header>
	<Card.Content>
		<div
			class={cn(
				"text-2xl font-semibold",
				account.balance < 0 ? "text-danger" : ""
			)}
		>
			{formatCurrency(account.balance)}
		</div>
	</Card.Content>
</Card.Root>
