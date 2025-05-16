<script lang="ts">
	export let data;
	let radius = data.radius ?? "";
	let selectedSpeciesId = data.speciesId ?? "";
	let speciesSearch = "";
	let showDropdown = false;

	let speciesList = data.speciesList ?? [];
	let filteredSpecies = speciesList;

	$: filteredSpecies = speciesList.filter((s) =>
		s.commonName.toLowerCase().includes(speciesSearch.toLowerCase())
	);

	function selectSpecies(s: { _id: string; commonName: string }) {
		selectedSpeciesId = s._id;
		speciesSearch = s.commonName;
		showDropdown = false;
	}

	function getLocationAndSearch() {
		navigator.geolocation.getCurrentPosition((pos) => {
			const lat = pos.coords.latitude;
			const long = pos.coords.longitude;

			const url = new URL(window.location.href);
			url.searchParams.set("lat", lat.toString());
			url.searchParams.set("long", long.toString());

			if (radius) url.searchParams.set("radius", radius.toString());
			if (selectedSpeciesId) url.searchParams.set("speciesId", selectedSpeciesId);

			window.location.href = url.toString();
		});
	}
</script>

<form method="GET" class="mx-auto mt-10 mb-6 max-w-3xl space-y-4 px-4">
	<div class="flex flex-col md:flex-row gap-4">
		<!-- Radius input -->
		<input
			type="number"
			name="radius"
			bind:value={radius}
			min="1"
			placeholder="📏 Distance Radius (Km)"
			class="flex-1 rounded-xl border border-gray-300 px-4 py-2 shadow-sm"
		/>

		<!-- Species searchable dropdown -->
		<div class="relative flex-1">
			<input
				type="text"
				placeholder="🌿 Search species..."
				bind:value={speciesSearch}
				on:focus={() => (showDropdown = true)}
				on:input={() => (showDropdown = true)}
				class="w-full rounded-xl border border-gray-300 px-4 py-2 shadow-sm"
			/>

			{#if showDropdown && filteredSpecies.length > 0}
				<ul class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md max-h-48 overflow-y-auto shadow-md">
					{#each filteredSpecies as s}
						<li>
							<button
								type="button"
								class="w-full text-left px-4 py-2 cursor-pointer hover:bg-green-100 focus:outline-none"
								on:click={() => selectSpecies(s)}
							>
								{s.commonName}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>

	<!-- Hidden input to pass selected speciesId -->
	<input type="hidden" name="speciesId" value={selectedSpeciesId} />

	<!-- Search button -->
	<button
		type="button"
		on:click={getLocationAndSearch}
		class="rounded-xl bg-green-600 text-white px-6 py-2 hover:bg-green-700 mt-2"
	>
		Search Nearby
	</button>
</form>






<!-- Results -->
{#if data.searched}
    {#if data.trees.length === 0}
        <p class="mt-8 text-center text-gray-500">No trees found matching your criteria.</p>
    {:else}
        <div class="mt-6 grid grid-cols-1 gap-5 px-4 md:grid-cols-2 lg:grid-cols-3">
            {#each data.trees as tree}
                <div class="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-100 transition-all hover:shadow-xl">
                    <p class="text-lg font-semibold text-green-800 mb-2">🌳 {tree.speciesName}</p>
                    <div class="text-sm text-gray-600 space-y-1">
                        <p><span class="font-medium text-gray-700">📍 Location:</span> {tree.location}</p>
                        <p><span class="font-medium text-gray-700">🗓️ Planted Date:</span> 
                            {tree.datePlanted
                                ? new Date(tree.datePlanted).toLocaleDateString()
                                : "Unknown"}
                        </p>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
{/if}

