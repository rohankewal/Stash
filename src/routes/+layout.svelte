<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '@/components/app-sidebar.svelte';

	import '../app.css';

	let { children } = $props();

	let date = new Date().getFullYear();
</script>

<Sidebar.Provider>
	<header
		class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
	>
		<div class="flex items-center gap-2 px-4">
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Sidebar.Trigger class="-ml-1" />
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item class="hidden md:block">
						<Breadcrumb.Link href="#">Building Your Application</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="hidden md:block" />
					<Breadcrumb.Item>
						<Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</div>
	</header>
	<AppSidebar />
	<main>
		{@render children()}
	</main>
	<footer>
		Copyright {date} Rohan Kewalramani. All rights reserved.
	</footer>
</Sidebar.Provider>
