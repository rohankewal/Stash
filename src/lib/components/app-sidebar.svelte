<script lang="ts">
	import LayoutDashboard from "lucide-svelte/icons/layout-dashboard";
	import ArrowLeftRight from "lucide-svelte/icons/arrow-left-right";
	import PiggyBank from "lucide-svelte/icons/piggy-bank";
	import Wallet from "lucide-svelte/icons/wallet";
	import BarChart3 from "lucide-svelte/icons/chart-column";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { page } from "$app/stores";

	const items = [
		{ title: "Dashboard", url: "/", icon: LayoutDashboard },
		{ title: "Transactions", url: "/transactions", icon: ArrowLeftRight },
		{ title: "Budgets", url: "/budgets", icon: PiggyBank },
		{ title: "Accounts", url: "/accounts", icon: Wallet },
		{ title: "Analytics", url: "/analytics", icon: BarChart3 },
	];
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<div class="flex items-center gap-2 px-2 py-1">
			<div
				class="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-background"
			>
				<span class="text-sm font-bold">S</span>
			</div>
			<span class="text-base font-semibold tracking-tight">Stash</span>
		</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								isActive={$page.url.pathname === item.url}
							>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<div class="px-2 py-1 text-xs text-muted-foreground">Personal Finance</div>
	</Sidebar.Footer>
</Sidebar.Root>
