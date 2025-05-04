<script lang="ts">
    import { fade } from "svelte/transition";
    import { goto } from "$app/navigation";
    import type { ChangeEventHandler } from "svelte/elements";

    let dWideNav = $state(false);
    let selScene = $state("/app");
    let navSpans: { [elem: string]: HTMLSpanElement } = $state({});

    const sceneChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        goto(selScene);
    };

    function divStyle() {
        return dWideNav ? "w-64" : "w-ico";
    }
</script>

<div class="bg-light-2 dark:bg-dark-2 box-content p-4 transition-all {divStyle()}">
    <div class="*:not-last:mb-nav">
        <button
            onclick={() => {
                dWideNav = !dWideNav;
            }}
            class="size-ico"
        >
            <img src="https://dummyimage.com/128x128/000/fff" alt="" />
        </button>

        <nav class="overflow-x-hidden *:flex *:items-center *:gap-2 *:not-last:mb-4">
            <label>
                <img src="https://dummyimage.com/128x128/000/fff" alt="" class="size-ico inline" />
                <input
                    type="radio"
                    name="scene"
                    bind:group={selScene}
                    value="/app/account"
                    onchange={sceneChange}
                    class="hidden"
                />
                {#if dWideNav}
                    <span transition:fade bind:this={navSpans.account}>Account</span>
                {/if}
            </label>
            <label>
                <img src="https://dummyimage.com/128x128/000/fff" alt="" class="size-ico inline" />
                <input
                    type="radio"
                    name="scene"
                    bind:group={selScene}
                    value="/app"
                    onchange={sceneChange}
                    class="hidden"
                />
                {#if dWideNav}
                    <span transition:fade bind:this={navSpans.home}>Home</span>
                {/if}
            </label>
            <label>
                <img src="https://dummyimage.com/128x128/000/fff" alt="" class="size-ico inline" />
                <input
                    type="radio"
                    name="scene"
                    bind:group={selScene}
                    value="/app/search"
                    onchange={sceneChange}
                    class="hidden"
                />
                {#if dWideNav}
                    <span transition:fade bind:this={navSpans.search}>Search</span>
                {/if}
            </label>
            <label>
                <img src="https://dummyimage.com/128x128/000/fff" alt="" class="size-ico inline" />
                <input
                    type="radio"
                    name="scene"
                    bind:group={selScene}
                    value="/app/map"
                    onchange={sceneChange}
                    class="hidden"
                />
                {#if dWideNav}
                    <span transition:fade bind:this={navSpans.map}>Map</span>
                {/if}
            </label>
            <label>
                <img src="https://dummyimage.com/128x128/000/fff" alt="" class="size-ico inline" />
                <input
                    type="radio"
                    name="scene"
                    bind:group={selScene}
                    value="/app/guides"
                    onchange={sceneChange}
                    class="hidden"
                />
                {#if dWideNav}
                    <span transition:fade bind:this={navSpans.guides}>Guides</span>
                {/if}
            </label>
        </nav>
    </div>
</div>
