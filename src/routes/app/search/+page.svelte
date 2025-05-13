<script lang="ts">
    import type { LocationResult, TreeResult } from "$lib/search";

    let { data } = $props();

    let showFilters: boolean = $state(true);

    function filterDivStyle() {
        return showFilters ? "max-h-12 opacity-100 border" : "max-h-0 opacity-0";
    }

    function buttonImgStyle() {
        return showFilters ? "rotate-180" : "rotate-0";
    }

    function locationLastTwo(location: LocationResult) {
        if (!location.properties) return;

        const locNameArr: string[] = location.properties.display_name.split(", ");
        return `${locNameArr[locNameArr.length - 2]}, ${locNameArr[locNameArr.length - 1]}`;
    }
</script>

<!-- Snippets -->
{#snippet locationCard(location: LocationResult)}
    <a href="/app/map" aria-label="city" class="flex items-center gap-2 rounded border p-2">
        <img src="https://dummyimage.com/128x128/000/fff" alt="" class="size-16" />
        <div>
            <h5>{location.properties?.name}</h5>
            <p>{locationLastTwo(location)}</p>
        </div>
    </a>
{/snippet}

{#snippet treeCard(tree: TreeResult)}
    <a href="/app/tree/{tree.id}" aria-label="tree" class="mb-2 block rounded border p-2">
        <h5 class="capitalize">{tree.commonName.toLowerCase()}</h5>
        <p class="capitalize">{tree.scientificName.toLowerCase()}</p>
        <p>{Math.round(tree.distance)} m</p>
    </a>
{/snippet}

<!-- Form -->
<form class="p-search mx-auto max-w-xl *:not-last:mb-2">
    <label class="flex divide-x rounded border *:p-2">
        <input type="text" name="search" placeholder="Search here" class="w-full" />
        <button type="submit">Search</button>
    </label>

    <button
        type="button"
        class="flex gap-2 transition-all"
        onclick={() => {
            showFilters = !showFilters;
        }}
    >
        <span>Filter</span>
        <img
            src="/icons/chevron-down.svg"
            alt=""
            class="size-6 transition dark:invert {buttonImgStyle()}"
        />
    </button>

    <div class="{filterDivStyle()} divide-y overflow-hidden rounded transition-all">
        <label class="flex items-center divide-x *:p-2">
            <span class="w-full max-w-32">Species</span>
            <input type="text" name="species" class="w-full" />
        </label>
        <!-- <label class="flex items-center divide-x *:p-2">
            <span class="w-full max-w-32">Height</span>
            <input type="number" name="height" class="w-full" placeholder="(in meters)" />
        </label> -->
    </div>
</form>

<!-- Search Results -->
{#if data.searchResults}
    <div class="px-edge-m md:px-edge-d mx-auto max-w-xl *:mb-8">
        {#each data.searchResults as { locationResult, treeResults }}
            <div class="*:not-last:mb-2">
                {@render locationCard(locationResult)}

                {#each treeResults as treeResult}
                    {@render treeCard(treeResult)}
                {/each}

                {#if treeResults.length == 0}
                    <p>No trees in this area.</p>
                {/if}
            </div>
        {/each}
    </div>
{/if}

<!-- <div class="mx-auto max-w-5xl p-6">
    <h1 class="mb-8 text-center text-3xl font-bold text-green-700">Search for Trees</h1>

    <form method="GET" class="form-wrapper">
        <div>
            <label for="species" class="input-label">Species</label>
            <input
                id="species"
                name="species"
                placeholder="e.g., oak, maple"
                bind:value={species}
                class="input-field"
            />
        </div>

        <div>
            <label for="location" class="input-label">Location</label>
            <input
                id="location"
                name="location"
                placeholder="e.g., Burnaby"
                bind:value={location}
                class="input-field"
            />
        </div>

        <div class="text-right">
            <button type="submit" class="search-button">Search Trees</button>
        </div>
    </form>

    {#if data.trees.length}
        <div class="tree-grid">
            {#each data.trees as tree}
                <a href={`/app/tree/${tree._id}`} class="tree-card">
                    {#if tree.imageUrl}
                        <img src={tree.imageUrl} alt={tree.name} class="tree-card-image" />
                    {:else}
                        <div class="tree-card-placeholder">No Image</div>
                    {/if}
                    <h2 class="tree-title">{tree.name}</h2>
                    <p class="tree-subtext">{tree.species} • {tree.location}</p>
                </a>
            {/each}
        </div>
    {:else if data.searched}
        <p class="mt-8 text-center text-sm text-gray-600">
            No trees found with the selected filters.
        </p>
    {/if}
</div> -->
