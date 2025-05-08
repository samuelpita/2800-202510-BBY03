<script lang="ts">
    import { fade } from "svelte/transition";
    import { Menu, TreePine, Home, User, Search, MapPin, Book } from 'lucide-svelte';
    import { page } from '$app/stores';
    import { derived } from 'svelte/store';

    let dWideNav = $state(true); // open by default
    const currentPath = derived(page, ($page) => $page.url.pathname);
</script>

{#snippet navLink(icon: typeof Menu, href: string, name: string)}
    {@const Icon = icon}
    <a {href} class="group nav-link-item w-full">
        <div class="nav-item-box" class:collapsed={!dWideNav}>
            <Icon class="icon" />
            {#if dWideNav}
                <span class="text-xxs">{name}</span>
            {/if}
        </div>
    </a>
{/snippet}

<!-- Desktop Sidebar Only -->
<div class="bg-light-2 dark:bg-dark-2 box-content p-4 hidden md:block transition-all duration-300 ease-in-out"
     class:w-56={dWideNav}
     class:w-16={!dWideNav}>

    <div class="overflow-x-hidden transition-all *:not-last:mb-6">
        <div class="group nav-link-item mb-6">
			<button onclick={() => dWideNav = !dWideNav} aria-label="Toggle menu" class="w-full">
				<div class="nav-item-box collapsed">
					<Menu class="icon" />
				</div>
			</button>
		</div>
		
		<a href="/" class="group nav-link-item mb-8">
			<div class="nav-item-box" class:collapsed={!dWideNav}>
				<TreePine class="icon" />
				{#if dWideNav}
					<h5 transition:fade class="text-sm font-semibold">Lorax</h5>
				{/if}
			</div>
		</a>

        <nav>
            {@render navLink(User, "/app/account", "Account")}
            {@render navLink(Home, "/app", "Home")}
            {@render navLink(Search, "/app/search", "Search")}
            {@render navLink(MapPin, "/app/map", "Map")}
            {@render navLink(Book, "/app/guides", "Guides")}
        </nav>
    </div>
</div>
