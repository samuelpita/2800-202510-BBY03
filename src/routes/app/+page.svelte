<script lang="ts">
     import type { AdoptedTree } from '$lib/server/db/types';

    let { data } = $props();
    const adoptedTrees = $derived((data.adoptedTrees || []) as AdoptedTree[]);
</script>

<div class="p-edge-d mx-auto max-w-4xl space-y-6">

    <section class="adopted-trees-section">
        <h2 class="mb-2 text-xl font-semibold">Adopted Trees</h2>
        <div class="rounded-lg dark:bg-dark-2 p-3">
            {#if adoptedTrees.length > 0}
                <div class="divide-y dark:divide-gray-700">
                    {#each adoptedTrees as item}
                        <a href="/app/log?treeId={item.tree._id}" class="block p-3 hover:bg-gray-800 dark:hover:bg-dark-1 transition-colors">
                            <div class="flex items-center">
                                <img src="/icons/tree.svg" alt="Tree icon" class="h-8 w-8 mr-3 dark:invert" />
                                <div>
                                    {#if item.tree.speciesInfo}
                                        <h3 class="font-medium capitalize">{item.tree.speciesInfo.commonName}</h3>
                                        <p class="text-sm text-gray-600 dark:text-gray-400 italic">{item.tree.speciesInfo.scientificName}</p>
                                    {:else}
                                        <h3 class="font-medium">Tree #{item.tree._id.substring(0, 6)}</h3>
                                    {/if}
                                    <p class="text-xs text-gray-500 dark:text-gray-400">Adopted on {new Date(item.adoption.dateAdopted).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            {:else}
                <div class="text-center py-4">
                    <p class="text-gray-600 dark:text-gray-400 mb-3">You haven't adopted any trees yet.</p>
                </div>
            {/if}
        </div>
    </section>
</div>
