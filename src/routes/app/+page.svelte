<script lang="ts">
     const quickActions = [
        { title: 'Adopt a Tree', icon: '🌳', link: '/app/search' },
        { title: 'Log Tree Care', icon: '🛠️', link: '/app/actions/new' },
        { title: 'View My Profile', icon: '👤', link: '/app/account' }
    ];

    type AdoptedTree = {
        adoption: {
            _id: string;
            userId: string;
            treeId: string;
            active: boolean;
            dateAdopted: string | Date;
        };
        tree: {
            _id: string;
            treeSpeciesId: string;
            location?: any;
            datePlanted?: Date;
            dateCreated?: Date;
            speciesInfo?: {
                commonName: string;
                scientificName: string;
            };
        };
    };

    let { data } = $props();
    const adoptedTrees = $derived((data.adoptedTrees || []) as AdoptedTree[]);
</script>

<div class="p-edge-d mx-auto max-w-4xl space-y-6">
    <header class="mb-4">
        <h1 class="text-3xl font-bold">Lorax</h1>
        <!-- Placeholder for Notifications -->
        <div class="flex mt-2 justify-center rounded-lg dark:bg-dark-2 p-3">
            <p class="text-sm text-gray-600">Notifications</p>
        </div>
    </header>

    <section class="quick-actions">
        <h2 class="mb-2 text-xl font-semibold">Quick Actions</h2>
        <div class="rounded-lg dark:bg-dark-2 p-3">
            <div class="flex flex-wrap gap-2">
                {#each quickActions as action}
                    <a href={action.link} class="flex-1 min-w-32 rounded-md bg-primary-600 p-3 text-center text-white hover:bg-primary-700">
                        <div class="text-2xl">{action.icon}</div>
                        <div class="mt-1 text-sm">{action.title}</div>
                    </a>
                {/each}
            </div>
        </div>
    </section>

    <section class="adopted-trees-section">
        <h2 class="mb-2 text-xl font-semibold">Adopted Trees</h2>
        <div class="rounded-lg dark:bg-dark-2 p-3">
            {#if adoptedTrees.length > 0}
                <div class="divide-y dark:divide-gray-700">
                    {#each adoptedTrees as item}
                        <a href="/app/actions/new?treeId={item.tree._id}" class="block p-3 hover:bg-gray-800 dark:hover:bg-dark-1 transition-colors">
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
        <!-- Placeholder for Trees Near You -->
    <section class="trees-near-you">
        <h2 class="mb-2 text-xl font-semibold">Trees Near You</h2>
        <div class="flex h-48 items-center justify-center rounded-lg dark:bg-dark-2 p-3">
            <p class="text-gray-500">(Map or List view)</p>
        </div>
    </section>
</div>
