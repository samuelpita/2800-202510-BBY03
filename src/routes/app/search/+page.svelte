<script lang="ts">
    import { page } from "$app/state";
    import type { PageData } from "./$types";

    type SearchOption = "all" | "location" | "species" | "user";

    const searchPlaceholders = {
        all: "Search here",
        location: "Search location",
        species: "Search species name",
        user: "Search username",
    };

    let search = $state("");
    let searchFocus = $state(false);
    let searchMode: SearchOption = $state("all");

    let params = $derived(page.url.searchParams);

    let { data }: { data: PageData } = $props();
</script>

{#snippet dropdownSearchButton(option: SearchOption, message: [string, string])}
    <button
        type="submit"
        onclick={() => {
            searchMode = option;
        }}
    >
        {message[0]} "{search}" {message[1]}
    </button>
{/snippet}

{#snippet locationResultCard(href: string, heading: string, body: string)}
    <a {href} class="*:capitalize">
        <h4>{heading}</h4>
        <p>{body}</p>
    </a>
{/snippet}

{#snippet treeResultCard(id: string, heading: string, body: string, distance_m: number | string)}
    <a href="/app/tree/{id}">
        <div class="flex items-center">
            <img src="/icons/tree.svg" alt="" class="mr-2 size-8 dark:invert" />
            <div class="w-full *:capitalize">
                <h5>{heading}</h5>
                <p>{body}</p>
            </div>
            <p class="min-w-max">{distance_m} m</p>
        </div>
    </a>
{/snippet}

{#snippet displayAllResults()}
    {#if data.treesResultArray}
        {#each data.treesResultArray as { locationResult, treeResults }}
            <div class="divide-y rounded border *:block *:p-2">
                {@render locationResultCard(
                    "/",
                    locationResult.properties.name,
                    `${locationResult.properties.address.state}, ${locationResult.properties.address.country}`,
                )}

                {#each treeResults as treeResult}
                    {@render treeResultCard(
                        treeResult._id,
                        treeResult.commonName,
                        treeResult.scientificName,
                        treeResult.distance ? Math.round(treeResult.distance) : "",
                    )}
                {/each}

                {#if treeResults.length == 0}
                    <p>No trees to show in this area.</p>
                {/if}
            </div>
        {/each}
    {/if}
{/snippet}

<form class="p-edge-m mx-auto max-w-2xl *:not-last:mb-4">
    <div class="divide-y rounded border *:flex *:*:p-2">
        <!-- Search Bar -->
        <label class="divide-x">
            {#if ["location", "species", "user"].includes(searchMode)}
                <button
                    type="button"
                    class="min-w-max"
                    onclick={() => {
                        searchMode = "all";
                    }}
                >
                    <span class="align-middle capitalize">{searchMode}</span>
                    <img src="/icons/x.svg" alt="" class="inline-block size-6 dark:invert" />
                </button>
            {/if}
            <input
                type="text"
                name={searchMode}
                class="w-full"
                placeholder={searchPlaceholders[searchMode]}
                onfocus={() => {
                    searchFocus = true;
                }}
                onblur={() => {
                    searchFocus = false;
                }}
                bind:value={search}
            />
            <button type="submit" class="min-w-max">
                <span class="align-middle">Search</span>
                <img src="/icons/search.svg" alt="" class="inline-block size-6 dark:invert" />
            </button>
        </label>

        <!-- Dropdown -->
        {#if search && (search != params.get(searchMode) || searchFocus)}
            <div class="flex-col divide-y">
                {@render dropdownSearchButton("all", ["Search trees in", ""])}
                {@render dropdownSearchButton("species", ["Search", "tree species"])}
                {@render dropdownSearchButton("location", ["Search", "place name"])}
                {@render dropdownSearchButton("user", ["Search username", ""])}
            </div>
        {/if}
    </div>

    {#if searchMode == "all"}
        <label class="flex divide-x rounded border *:p-2">
            <span class="min-w-40">Species</span>
            <input type="text" name="species" placeholder="Species name" class="w-full" />
        </label>
    {/if}
</form>

<!-- Results -->
<div class="px-edge-m pb-edge-m mx-auto max-w-2xl *:not-last:mb-6">
    {@render displayAllResults()}
</div>
