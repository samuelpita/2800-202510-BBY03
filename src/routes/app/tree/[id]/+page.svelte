<script lang="ts">
    export let data;
    const tree = data.tree;
  </script>
  
  {#if tree}
    <div class="detail-container">
      <h1 class="detail-title">{tree.name}</h1>
  
      {#if tree.imageUrl}
        <img src={tree.imageUrl} alt={tree.name} class="detail-image" />
      {:else}
        <div class="detail-image-placeholder">No image available</div>
      {/if}
  
      <div class="detail-info">
        <div><span class="detail-label">Species:</span> {tree.species}</div>
        <div><span class="detail-label">Location:</span> {tree.location}</div>
  
        {#if tree.health}
          <div><span class="detail-label">Health:</span> {tree.health}</div>
        {/if}
  
        {#if tree.ageType}
          <div><span class="detail-label">Age Type:</span> {tree.ageType}</div>
        {/if}
  
        {#if tree.height !== undefined}
          <div><span class="detail-label">Height:</span> {tree.height} meters</div>
        {/if}
  
        {#if tree.plantedDate}
          <div><span class="detail-label">Planted:</span> {tree.plantedDate}</div>
        {/if}
  
        {#if tree.description}
          <div>
            <span class="detail-label">Description:</span>
            <p class="detail-description">{tree.description}</p>
          </div>
        {/if}
      </div>
  
      <a href="/app/search" class="back-link">← Back to Search</a>
    </div>
  {:else}
    <p class="text-center text-gray-500 mt-6">Tree not found.</p>
  {/if}
  