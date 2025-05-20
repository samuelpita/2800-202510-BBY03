<script lang="ts">
  import { goto } from "$app/navigation";
  import type { Tree } from '$lib/server/db/types';
  
  let { data } = $props();
  
  const tree = $derived(data.tree as Tree);
  
  let isAdopting = $state(false);
  let adoptionMessage = $state("");
  let adoptionError = $state("");
  
  async function adoptTree() {
    try {
      isAdopting = true;
      adoptionMessage = "";
      adoptionError = "";
      
      const response = await fetch(`/api/adopt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          treeId: tree._id
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        adoptionMessage = "Tree adopted successfully!";
        // Redirect home after 2 seconds
        setTimeout(() => {
          goto("/app");
        }, 2000);
      } else {
        adoptionError = result.message || "Failed to adopt tree";
      }
    } catch (error) {
      adoptionError = "An error occurred. Please try again.";
      console.error(error);
    } finally {
      isAdopting = false;
    }
  }
</script>

<div class="p-4 max-w-3xl mx-auto">
  {#if tree && tree._id}
    <div class="bg-white dark:bg-dark-2 rounded-lg shadow-md p-6">
      <div class="flex items-center mb-4">
        <img src="/icons/tree.svg" alt="Tree icon" class="h-12 w-12 mr-4 dark:invert" />
        <h1 class="text-2xl font-bold">Tree Details</h1>
      </div>
      
      <div class="mb-6">
        {#if tree.speciesInfo}
          <h2 class="text-xl font-semibold mb-2 capitalize">{tree.speciesInfo.commonName}</h2>
          <p class="text-gray-600 dark:text-gray-300 italic mb-4">{tree.speciesInfo.scientificName}</p>
        {/if}
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 class="font-medium text-gray-700 dark:text-gray-300">Location</h3>
            <p>Lat: {tree.location?.coordinates?.[1] || 'N/A'}</p>
            <p>Long: {tree.location?.coordinates?.[0] || 'N/A'}</p>
          </div>
          <div>
            <h3 class="font-medium text-gray-700 dark:text-gray-300">Planted</h3>
            <p>{tree.datePlanted ? new Date(tree.datePlanted).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>
      
      <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p class="mb-4">By adopting this tree, you commit to its care and maintenance. Your contribution helps our urban forest thrive!</p>
        
        {#if adoptionMessage}
          <div class="p-3 bg-green-100 text-green-800 rounded-md mb-4">
            {adoptionMessage}
          </div>
        {/if}
        
        {#if adoptionError}
          <div class="p-3 bg-red-100 text-red-800 rounded-md mb-4">
            {adoptionError}
          </div>
        {/if}
        
        <button 
          class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          onclick={adoptTree}
          disabled={isAdopting}
        >
          {#if isAdopting}
            Adopting...
          {:else}
            Adopt Tree
          {/if}
        </button>
      </div>
    </div>
  {:else}
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
      <p class="text-xl">Tree not found.</p>
      <a href="/app/search" class="text-blue-600 hover:underline mt-2 inline-block">Search for trees</a>
    </div>
  {/if}
</div> 