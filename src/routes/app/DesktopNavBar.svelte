<script lang="ts">
    import { fade } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import type { ChangeEventHandler } from "svelte/elements";

    let dWideNav = $state(false);
    let selectedPath = $state(page.url.pathname);
    let navSpans: { [elem: string]: HTMLSpanElement } = $state({});

    const sceneChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        goto(selectedPath);
    };

    function divStyle() {
        return dWideNav ? "w-56" : "w-ico";
    }
</script>

{#snippet radioNavLink(src: string, path: string, name: string)}
    <label class="flex cursor-pointer items-center gap-2 not-last:mb-4">
        <img {src} alt="" class="size-ico" />
        <input
            type="radio"
            name="scene"
            bind:group={selectedPath}
            value={path}
            onchange={sceneChange}
            class="hidden"
        />
        {#if dWideNav}
            <span transition:fade bind:this={navSpans.account}>{name}</span>
        {/if}
    </label>
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
            {@render radioNavLink(
                "https://dummyimage.com/128x128/000/fff",
                "/app/account",
                "Account",
            )}
            {@render radioNavLink("https://dummyimage.com/128x128/000/fff", "/app", "Home")}
            {@render radioNavLink(
                "https://dummyimage.com/128x128/000/fff",
                "/app/search",
                "Search",
            )}
            {@render radioNavLink("https://dummyimage.com/128x128/000/fff", "/app/map", "Map")}
            {@render radioNavLink(
                "https://dummyimage.com/128x128/000/fff",
                "/app/guides",
                "Guides",
            )}
        </nav>
    </div>
</div>
