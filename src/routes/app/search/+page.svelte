<script lang="ts">
    import { fade } from "svelte/transition";
    import { page } from "$app/state";
    import { positionToString } from "$lib/geolocation";
    import { TreePine, MapPin, User, TriangleAlert } from "lucide-svelte";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";

    type SearchOption = "all" | "location" | "species" | "user";

    const searchPlaceholders = {
        all: "Search here",
        guides: "Search guides",
        location: "Search location",
        species: "Search species name",
        user: "Search username",
    };

    let userCoordinates: string = $state("#0_0");
    let userCoordinatesValid = $state(false);

    let search = $state("");
    let searchFocus = $state(false);
    let searchMode: SearchOption = $state("all");

    let params = $derived(page.url.searchParams);

    let { data }: { data: PageData } = $props();

    onMount(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                let long = pos.coords.longitude;
                let lat = pos.coords.latitude;

                userCoordinates = positionToString([long, lat]);
                userCoordinatesValid = true;
            },
            (error) => console.error(error),
        );
    });
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
        <div class="flex items-center">
            <MapPin class="mr-2 size-8" />
            <div class="w-full">
                <h3 class="text-3xl">{heading}</h3>
                <p>{body}</p>
            </div>
        </div>
    </a>
{/snippet}

{#snippet treeResultCard(
    id: string,
    heading: string,
    body: string,
    address?: string,
    distance_m?: number | string,
)}
    <a href="/app/tree/{id}">
        <div class="flex items-center">
            <TreePine class="mr-2 size-8" />
            <div class="w-full *:capitalize">
                <h5 class="text-xl">{heading}</h5>
                <p>{body}</p>
                {#if address}
                    <p>{address}</p>
                {/if}
            </div>
            {#if distance_m != undefined}
                <p class="min-w-max">{distance_m} m</p>
            {/if}
        </div>
    </a>
{/snippet}

{#snippet treeSpeciesResultCard(id: string, commonName: string, scientificName: string)}
    <a href="/app/tree/species/{id}">
        <div class="flex items-center">
            <TreePine class="mr-2 size-8" />
            <div class="w-full *:capitalize">
                <h5>{commonName}</h5>
                <p class="italic">{scientificName}</p>
            </div>
        </div>
    </a>
{/snippet}

{#snippet userResultCard(id: string, username: string)}
    <a href="/app/user/{id}">
        <div class="flex items-center">
            <User class="mr-2 size-8" />
            <div class="w-full">
                <h5>{username}</h5>
            </div>
        </div>
    </a>
{/snippet}

{#snippet displayTreesNearbyResults()}
    {#if data.treesNearPositionResults}
        <div class="divide-y rounded border *:block *:p-2">
            {#each data.treesNearPositionResults as treeResult}
                {@render treeResultCard(
                    treeResult._id,
                    treeResult.commonName,
                    treeResult.scientificName,
                    treeResult.address,
                    treeResult.distance ? Math.round(treeResult.distance) : "",
                )}
            {/each}

            {#if data.treesNearPositionResults.length == 0}
                <span>No adoptable trees exist near you.</span>
            {/if}
        </div>
    {/if}
{/snippet}

{#snippet displayTreesInLocationResults()}
    {#if data.treesInLocationResults}
        {#each data.treesInLocationResults as { locationResult, treeResults }}
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
                        treeResult.address,
                    )}
                {/each}

                {#if treeResults.length == 0}
                    <p>No trees to show in this area.</p>
                {/if}
            </div>
        {/each}
    {/if}
{/snippet}

{#snippet displayTreeSpeciesResults()}
    {#if data.treeSpeciesResultArray}
        <div class="divide-y rounded border *:block *:p-2">
            {#each data.treeSpeciesResultArray as { _id, commonName, scientificName }}
                {@render treeSpeciesResultCard(_id, commonName, scientificName)}
            {/each}
        </div>
    {/if}
{/snippet}

{#snippet displayUserResults()}
    {#if data.userResultArray}
        <div class="divide-y rounded border *:block *:p-2">
            {#each data.userResultArray as { _id, username }}
                {@render userResultCard(_id, username)}
            {/each}
        </div>
    {/if}
{/snippet}

{#snippet coordinatesError()}
    {#if !userCoordinatesValid}
        <div transition:fade class="flex items-center gap-3 rounded bg-red-500 p-3">
            <TriangleAlert class="min-h-6 min-w-6" color="white" />
            <span class="text-white">Nearby search is unavailable; trying to find your location</span>
        </div>
    {/if}
{/snippet}

<form class="p-edge-m mx-auto max-w-2xl *:not-last:mb-4">
    {@render coordinatesError()}

    <div class="divide-y rounded border *:flex *:*:p-2">
        <!-- Search Bar -->
        <label class="divide-x">
            {#if ["guides", "location", "species", "user"].includes(searchMode)}
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
                {@render dropdownSearchButton("all", ["Search nearest", ""])}
                {@render dropdownSearchButton("location", ["Search trees in", ""])}
                {@render dropdownSearchButton("species", ["Search", "tree species"])}
                {@render dropdownSearchButton("user", ["Search username", ""])}
            </div>
        {/if}
    </div>

    <div class="divide-y rounded border *:flex *:divide-x *:*:p-2 empty:hidden">
        {#if searchMode == "all"}
            <label>
                <span class="min-w-36">Radius (km)</span>
                <input type="number" name="radius" min="1" value="20" class="w-full" />
            </label>
        {:else if ["location", "guides"].includes(searchMode)}
            <label>
                <span class="min-w-36">Species</span>
                <input type="text" name="species" class="w-full" />
            </label>
        {/if}
    </div>

    {#if searchMode == "all"}
        <input type="text" name="userCoordinates" value={userCoordinates} class="hidden" />
    {/if}
</form>

<!-- Results -->
<div class="px-edge-m pb-edge-m mx-auto max-w-2xl *:not-last:mb-6">
    {@render displayTreesNearbyResults()}
    {@render displayTreesInLocationResults()}
    {@render displayTreeSpeciesResults()}
    {@render displayUserResults()}
</div>
