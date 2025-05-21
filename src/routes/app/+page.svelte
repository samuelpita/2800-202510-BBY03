<script lang="ts">
    import type { AdoptedTree } from "$lib/server/db/types";

    let { data } = $props();
    const adoptedTrees = $derived((data.adoptedTrees || []) as AdoptedTree[]);
</script>

<div class="p-edge-d mx-auto max-w-4xl space-y-6">
    <section class="adopted-trees-section">
        <h2 class="mb-2 text-xl font-semibold">Adopted Trees</h2>
        <div class="dark:bg-dark-2 rounded-lg p-3">
            {#if adoptedTrees.length > 0}
                <div class="divide-y dark:divide-gray-700">
                    {#each adoptedTrees as item}
                        <a
                            href="/app/log?treeId={item.tree._id}"
                            class="dark:hover:bg-dark-1 block p-3 transition-colors hover:bg-gray-800"
                        >
                            <div class="flex items-center">
                                <img
                                    src="/icons/tree.svg"
                                    alt="Tree icon"
                                    class="mr-3 h-8 w-8 dark:invert"
                                />
                                <div>
                                    {#if item.tree.speciesInfo}
                                        <h3 class="font-medium capitalize">
                                            {item.tree.speciesInfo.commonName}
                                        </h3>
                                        <p class="text-sm text-gray-600 italic dark:text-gray-400">
                                            {item.tree.speciesInfo.scientificName}
                                        </p>
                                    {:else}
                                        <h3 class="font-medium">
                                            Tree #{item.tree._id.substring(0, 6)}
                                        </h3>
                                    {/if}
                                    <p class="text-xs text-gray-500 dark:text-gray-400">
                                        Adopted on {new Date(
                                            item.adoption.dateAdopted,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            {:else}
                <div class="py-4 text-center">
                    <p class="mb-3 text-gray-600 dark:text-gray-400">
                        You haven't adopted any trees yet.
                    </p>
                </div>
            {/if}
        </div>
    </section>
</div>
