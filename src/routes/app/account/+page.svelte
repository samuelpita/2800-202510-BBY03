<script lang="ts">
	import type { PageData } from './$types'; 
	import type { AdoptedTree } from '$lib/server/db/types';
	import { Mail, TreePine, Calendar } from 'lucide-svelte';
	
	let { data } = $props();
	const adoptedTrees = $derived((data.adoptedTrees || []) as AdoptedTree[]);
</script>

<div class="p-edge-d mx-auto max-w-3xl text-gray-200">
	<div class="pt-10">
		{#if data.user}
			<div class="dark:bg-dark-2 p-6 rounded-lg shadow-lg mb-8">
				<div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
					<div class="relative">
						<div class="flex justify-center items-center w-24 h-24 rounded-full bg-gray-700 border-4 border-orange-600 text-white overflow-hidden">
							{#if data.user.profilePicture}
								<img 
									src={data.user.profilePicture} 
									alt="Profile" 
									class="w-full h-full object-cover" 
									onerror={(e) => {
										const img = e.currentTarget as HTMLImageElement;
										img.src = 'https://dummyimage.com/128x128/555/fff&text=User';
									}}
								/>
							{:else}
								<span class="text-xl">User</span>
							{/if}
						</div>
					</div>
					
					<div class="flex-grow">
						<div class="flex flex-col sm:flex-row sm:justify-between items-center sm:items-start mb-4">
							<div class="text-center sm:text-left">
								<h2 class="text-2xl font-semibold text-gray-100">{data.user.username}</h2>
								<div class="flex items-center justify-center sm:justify-start text-gray-400 mt-1">
									<Mail size={14} class="mr-1" />
									<p class="text-sm">{data.user.email}</p>
								</div>
							</div>
							
							<a href="/app/account/edit" class="mt-3 sm:mt-0 inline-block px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors no-underline">
								Edit Profile
							</a>
						</div>
						
						<div class="text-sm bg-dark-1 p-3 rounded-md">
							<div class="flex items-center text-gray-300 mb-1">
								<TreePine size={14} class="mr-2" />
								<span>Trees Adopted: {adoptedTrees.length}</span>
							</div>
							<div class="flex items-center text-gray-300">
								<Calendar size={14} class="mr-2" />
								<span>Member since: {new Date().getFullYear()}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="space-y-6">
				<!-- Adopted Trees Section -->
				<section class="adopted-trees-section">
					<h3 class="text-xl font-semibold mb-3 text-gray-300 flex items-center">
						My Adopted Trees
					</h3>
					<div class="dark:bg-dark-2 p-4 rounded-lg shadow-lg">
						{#if adoptedTrees.length > 0}
							<div class="divide-y dark:divide-gray-700">
								{#each adoptedTrees as item}
									<a href="/app/log?treeId={item.tree._id}" class="block p-3 hover:bg-dark transition-colors rounded-md my-1">
										<div class="flex items-center">
											<img src="/icons/tree.svg" alt="Tree icon" class="h-8 w-8 mr-3 dark:invert" />
											<div>
												{#if item.tree.speciesInfo}
													<h3 class="font-medium capitalize">{item.tree.speciesInfo.commonName}</h3>
													<p class="text-sm text-gray-500 dark:text-gray-400 italic">{item.tree.speciesInfo.scientificName}</p>
												{:else}
													<h3 class="font-medium">Tree #{item.tree._id.substring(0, 6)}</h3>
												{/if}
												<p class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
													<Calendar size={12} class="mr-1" />
													Adopted on {new Date(item.adoption.dateAdopted).toLocaleDateString()}
												</p>
											</div>
										</div>
									</a>
								{/each}
							</div>
						{:else}
							<div class="text-center py-6">
								<div class="flex justify-center mb-3">
									<TreePine size={40} class="text-gray-500" />
								</div>
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
							class="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-md shadow-sm transition-colors flex items-center justify-center"
						>Logout</button>
					</form>
				</section>
			</div>
		{:else}
			<div class="text-center bg-dark-2 rounded-lg p-8 shadow-lg">
				<p class="text-gray-500 text-xl mb-4">User data not available</p>
				<a href="/login" class="inline-block px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md transition-colors no-underline">
					Login
				</a>
			</div>
		{/if}
	</div>
</div>
