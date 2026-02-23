<script lang="ts">
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import AppSidebar from "$lib/components/app-sidebar.svelte";
	import { page } from "$app/stores";
	import { finance, seedIfEmpty } from "$lib/stores/index.js";
	import { onMount } from "svelte";

	import "../app.css";

	let { children } = $props();

	const routeLabels: Record<string, string> = {
		"/": "Dashboard",
		"/transactions": "Transactions",
		"/budgets": "Budgets",
		"/accounts": "Accounts",
		"/analytics": "Analytics",
	};

	const currentLabel = $derived(routeLabels[$page.url.pathname] || "Dashboard");

	onMount(() => {
		finance.load();
		seedIfEmpty();
	});
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header
			class="flex h-14 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Page>{currentLabel}</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<main class="flex-1 px-6 py-6">
			{@render children()}
		</main>
		<footer class="border-t px-6 py-4 text-xs text-muted-foreground">
			&copy; {new Date().getFullYear()} Stash. All rights reserved.
		</footer>
	</Sidebar.Inset>
</Sidebar.Provider>
