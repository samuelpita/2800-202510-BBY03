<script lang="ts">
    import { fade } from "svelte/transition";

    let dWideNav = $state(false);

    function divStyle() {
        return dWideNav ? "w-56" : "w-ico";
    }
</script>

{#snippet navLink(src: string, href: string, name: string)}
    <a {href} class="flex cursor-pointer items-center gap-2 not-last:mb-4">
        <img {src} alt="" class="size-ico" />
        {#if dWideNav}
            <span transition:fade>{name}</span>
        {/if}
    </a>
{/snippet}

<div class="bg-light-2 dark:bg-dark-2 box-content p-4">
    <div class="overflow-x-hidden transition-all *:not-last:mb-8 {divStyle()}">
        <button
            onclick={() => {
                dWideNav = !dWideNav;
            }}
        >
            <img src="https://dummyimage.com/128x128/000/fff" alt="" class="size-ico" />
        </button>

        <a href="/" class="flex w-full items-center gap-2">
            <img src="https://dummyimage.com/128x128/000/fff" alt="" class="size-ico" />
            {#if dWideNav}
                <h5 transition:fade>Lorax</h5>
            {/if}
        </a>

        <nav>
            {@render navLink("https://dummyimage.com/128x128/000/fff", "/app/account", "Account")}

            {@render navLink("https://dummyimage.com/128x128/000/fff", "/app", "Home")}

            {@render navLink("https://dummyimage.com/128x128/000/fff", "/app/search", "Search")}

            {@render navLink("https://dummyimage.com/128x128/000/fff", "/app/map", "Map")}

            {@render navLink("https://dummyimage.com/128x128/000/fff", "/app/guides", "Guides")}
        </nav>
    </div>
</div>
