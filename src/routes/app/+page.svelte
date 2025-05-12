<script lang="ts">
     // Quick action types
     const quickActions = [
        { title: 'Adopt a Tree', icon: '🌳', link: '/app/search' },
        { title: 'Log Tree Care', icon: '🛠️', link: '/app/actions/new' },
        { title: 'View My Profile', icon: '👤', link: '/app/account' }
    ];

</script>

<div class="p-edge-d mx-auto max-w-4xl space-y-6">
    <header class="mb-4">
        <h1 class="text-3xl font-bold">Lorax</h1>
        <!-- Placeholder for Notifications -->
        <div class="mt-2 rounded-lg dark:bg-dark-2 p-3">
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
            <p class="text-sm text-gray-600">tree list</p>
        </div>
    </section>

    <section class="trees-near-you">
        <h2 class="mb-2 text-xl font-semibold">Trees Near You</h2>
        <div class="flex h-48 items-center justify-center rounded-lg dark:bg-dark-2 p-3">
            <p class="text-gray-500">(Map or List view)</p>
        </div>
    </section>
</div>
