<script lang="ts">
  export let data;
  let location = data.queryLocation;
  let species = data.querySpecies;
</script>

<form method="GET" class="max-w-2xl mx-auto mt-8 mb-10 px-4">
  <div class="flex flex-col md:flex-row items-center gap-3 w-full">
    <input
      type="text"
      name="location"
      bind:value={location}
      placeholder="📍 Search by address..."
      class="flex-1 pl-4 pr-4 py-3 rounded-full bg-white border border-gray-200 shadow focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400 text-sm transition"
    />
    <input
      type="text"
      name="species"
      bind:value={species}
      placeholder="🌳 Search by species..."
      class="flex-1 pl-4 pr-4 py-3 rounded-full bg-white border border-gray-200 shadow focus:ring-2 focus:ring-green-400 focus:outline-none placeholder-gray-400 text-sm transition"
    />
    <button
      type="submit"
      class="px-6 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-medium shadow-md transition duration-200"
    >
      Search
    </button>
  </div>
</form>



{#if data.trees.length === 0}
    <p class="text-center text-gray-500 mt-12 text-lg">No trees found.</p>
{:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {#each data.trees as tree}
            <div class="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-200 p-4 text-center">
    {#if tree.imgUrl}
        <img
            src={tree.imgUrl}
            alt={`Image of ${tree.speciesName}`}
            class="w-full h-36 object-cover rounded-xl mb-4"
        />
    {/if}
    <h3 class="text-sm font-medium text-gray-800 mb-1">🌳{tree.speciesName}</h3>
    <p class="text-sm text-gray-600">📍 {tree.location}</p>
    <p class="text-sm text-gray-500 mt-1">🌱 Planted: 
        {tree.datePlanted ? new Date(tree.datePlanted).toLocaleDateString() : "Unknown"}
    </p>
</div>

        {/each}
    </div>
{/if}
