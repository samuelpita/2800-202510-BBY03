<script lang="ts">
    import { User, Home, Search, MapPin, Book } from 'lucide-svelte';
    import { page } from '$app/stores';
    import { derived } from 'svelte/store';

    const currentPath = derived(page, ($page) => $page.url.pathname);
</script>

{#snippet navLink(icon: typeof User, href: string, name: string)}
    {@const Icon = icon}
    <a {href} class="group nav-link-item">
        <div class="nav-item-box">
            <Icon class="icon" />
            <span class="text-xxs">{name}</span>
        </div>
    </a>
{/snippet}

<div class="bg-light-2 dark:bg-dark-2 fixed bottom-0 left-0 w-full z-50 border-t border-neutral-300 dark:border-neutral-600 shadow-md">
    <nav class="flex justify-around items-center px-4 py-2">
        {@render navLink(User, "/app/account", "Account")}
        {@render navLink(Home, "/app", "Home")}
        {@render navLink(Search, "/app/search", "Search")}
        {@render navLink(MapPin, "/app/map", "Map")}
        {@render navLink(Book, "/app/guides", "Guides")}
    </nav>
</div>
