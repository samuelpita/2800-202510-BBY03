<script lang="ts">
    import { fade } from "svelte/transition";
    import {
        Menu,
        TreePine,
        Home,
        User,
        Search,
        MapPin,
        Book,
        type Icon as IconType,
    } from "lucide-svelte";

    let dWideNav = $state(false);

    function divStyle() {
        return dWideNav ? "w-56" : "w-14";
    }

    function sidebarButtonStyle() {
        return dWideNav ? "rotate-180" : "rotate-0";
    }
</script>

{#snippet navLink(icon: typeof IconType, href: string, name: string)}
    {@const Icon = icon}
    <a {href} class="nav-item-box flex cursor-pointer items-center gap-2"> 
        <Icon class="min-w-ico min-h-ico" />
        {#if dWideNav}
            <span transition:fade>{name}</span>
        {/if}
    </a>
{/snippet}

<div class="bg-light-2 dark:bg-dark-2 box-content p-4 border-r">
    <div class="overflow-x-hidden transition-all *:not-last:mb-8 {divStyle()}">
        <button
            onclick={() => {
                dWideNav = !dWideNav;
            }}
            class="nav-item-box"
        >
            <Menu class="min-w-ico min-h-ico" />
        </button>

        <a href="/" class="nav-item-box flex w-full items-center gap-2">
            <TreePine class="min-w-ico min-h-ico" />
            {#if dWideNav}
                <h5 transition:fade class="text-2xl font-bold">Lorax</h5>
            {/if}
        </a>

        <nav class="*:not-last:mb-2">
            {@render navLink(User, "/app/account", "Account")}

            {@render navLink(Home, "/app", "Home")}

            {@render navLink(Search, "/app/search", "Search")}

            {@render navLink(MapPin, "/app/map", "Map")}

            {@render navLink(Book, "/app/guides", "Guides")}
        </nav>
    </div>
</div>
