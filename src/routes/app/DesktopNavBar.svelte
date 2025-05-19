<script lang="ts">
    import { fade } from "svelte/transition";
    import { Menu, TreePine, Home, User, Search, MapPin, Book } from 'lucide-svelte';
    import { page } from '$app/stores';
    import { derived } from 'svelte/store';

    let dWideNav = false; 

    function divStyle() {
        return dWideNav ? "w-56" : "w-ico";
    }

    function sidebarButtonStyle() {
        return dWideNav ? "rotate-180" : "rotate-0";
    }
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

<div class="bg-light-2 dark:bg-dark-2 box-content p-4">
    <div class="overflow-x-hidden transition-all *:not-last:mb-8 {divStyle()}">
        <button
            onclick={() => {
                dWideNav = !dWideNav;
            }}
        >
            <img
                src="/icons/chevron-right.svg"
                alt=""
                class="{sidebarButtonStyle()} size-ico transition-all dark:invert"
            />
        </button>

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
</div>