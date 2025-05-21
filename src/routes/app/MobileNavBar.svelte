<script lang="ts">
    import { User, Home, Search, MapPin, Book, type Icon as IconType } from "lucide-svelte";
</script>

{#snippet navLink(icon: typeof IconType, href: string, name: string)}
    {@const Icon = icon}
    <a {href} class="nav-item-box cursor-pointer">
        <Icon class="min-w-ico min-h-ico" />
    </a>
{/snippet}

<div class="h-nav bg-light-2 dark:bg-dark-2 w-full px-edge-m">
    <nav class="size-full flex justify-around items-center">
        {@render navLink(User, "/app/account", "Account")}
        {@render navLink(Home, "/app", "Home")}
        {@render navLink(Search, "/app/search", "Search")}
        {@render navLink(MapPin, "/app/map", "Map")}
        {@render navLink(Book, "/app/guides", "Guides")}
    </nav>
</div>
