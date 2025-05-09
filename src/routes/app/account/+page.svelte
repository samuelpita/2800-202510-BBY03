<script lang="ts">
	import type { PageData } from './$types'; 
	export let data: PageData; 

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

		<div class="space-y-4">
			<section class="achievements-preview">
				<h3 class="text-xl font-semibold mb-3 text-gray-300">My Achievements</h3>
				<div class="dark:bg-dark-2 p-4 rounded-lg shadow-lg min-h-[80px] flex items-center justify-center">
					<p class="text-gray-500">(Achievement list placeholder)</p>
				</div>
			</section>


			<section class="logout-action pt-6">
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
