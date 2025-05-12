<script lang="ts">
    export let data;
  
    let species = '';
    let location = '';
  </script>
  
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-center text-green-700 mb-8">Search for Trees</h1>
  
    <form method="GET" class="form-wrapper">
      <div>
        <label for="species" class="input-label">Species</label>
        <input id="species" name="species" placeholder="e.g., oak, maple" bind:value={species} class="input-field" />
      </div>
  
      <div>
        <label for="location" class="input-label">Location</label>
        <input id="location" name="location" placeholder="e.g., Burnaby" bind:value={location} class="input-field" />
      </div>
  
      <div class="text-right">
        <button type="submit" class="search-button">Search Trees</button>
      </div>
    </form>
  
    {#if data.trees.length}
      <div class="tree-grid">
        {#each data.trees as tree}
          <a href={`/app/tree/${tree._id}`} class="tree-card">
            {#if tree.imageUrl}
              <img src={tree.imageUrl} alt={tree.name} class="tree-card-image" />
            {:else}
              <div class="tree-card-placeholder">No Image</div>
            {/if}
            <h2 class="tree-title">{tree.name}</h2>
            <p class="tree-subtext">{tree.species} • {tree.location}</p>
          </a>
        {/each}
      </div>
    {:else if data.searched}
      <p class="text-sm mt-8 text-gray-600 text-center">No trees found with the selected filters.</p>
    {/if}
  </div>
  