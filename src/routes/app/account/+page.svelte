<script lang="ts">
	import type { PageData } from './$types'; 
	import type { AdoptedTree } from '$lib/server/db/types';
	
	let { data } = $props();
	const adoptedTrees = $derived((data.adoptedTrees || []) as AdoptedTree[]);

	// Placeholder for profile picture
	const profilePictureUrl = "https://dummyimage.com/128x128/000/fff&text=User"; 

</script>

<div class="p-edge-d mx-auto max-w-2xl text-gray-200">

	{#if data.user}
		<div class="dark:bg-dark-2 p-6 rounded-lg shadow-lg flex flex-col sm:flex-row items-center gap-6 mb-8">
			<img 
				src={profilePictureUrl} 
				alt="" 
				class="w-24 h-24 rounded-full border-4 border-gray-600 object-cover"
			/>
			<div class="text-center sm:text-left">
				<h2 class="text-2xl font-semibold text-gray-100">{data.user.username}</h2>
				<p class="text-gray-400">{data.user.email}</p>
				<a href="/app/account/edit" class="mt-3 inline-block px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors no-underline">
					Edit Profile
				</a>
			</div>
		</div>

		<div class="space-y-6">
            <!-- Adopted Trees Section -->
            <section class="adopted-trees-section">
                <h3 class="text-xl font-semibold mb-3 text-gray-300">My Adopted Trees</h3>
                <div class="dark:bg-dark-2 p-4 rounded-lg shadow-lg">
                    {#if adoptedTrees.length > 0}
                        <div class="divide-y dark:divide-gray-700">
                            {#each adoptedTrees as item}
                                <a href="/app/log?treeId={item.tree._id}" class="block p-3 hover:bg-gray-800 dark:hover:bg-dark-1 transition-colors">
                                    <div class="flex items-center">
                                        <img src="/icons/tree.svg" alt="Tree icon" class="h-8 w-8 mr-3 dark:invert" />
                                        <div>
                                            {#if item.tree.speciesInfo}
                                                <h3 class="font-medium capitalize">{item.tree.speciesInfo.commonName}</h3>
                                                <p class="text-sm text-gray-500 dark:text-gray-400 italic">{item.tree.speciesInfo.scientificName}</p>
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
                            <p class="text-gray-500 dark:text-gray-400 mb-3">You haven't adopted any trees yet.</p>
                            <a href="/app/explore" class="inline-block px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors no-underline">
                                Find Trees to Adopt
                            </a>
                        </div>
                    {/if}
                </div>
            </section>

			<section class="logout-action pt-2">
				<form method="POST" action="?/logout">
					<button 
						type="submit"
						class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md shadow-sm transition-colors"
					>
						Logout
					</button>
				</form>
			</section>
		</div>
	{:else}
		<p class="text-center text-gray-500 text-xl py-10">User data not available.</p>
		<!-- TODO: Add a link to login page? -->
	{/if}

</div>
