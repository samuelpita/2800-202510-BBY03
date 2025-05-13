<script lang="ts">
    let { data } = $props();

    let { tree, treeSpecies, treeStats } = data;
    let [long, lat] = tree.location.coordinates;
</script>

<div class="detail-container">
    <h1 class="detail-title capitalize">{treeSpecies.commonName}</h1>

    <img
        src={"https://dummyimage.com/600x400/000/fff"}
        alt={data.treeSpecies.commonName}
        class="detail-image"
    />

    <p class="detail-image-placeholder">No image available</p>

    <div class="detail-info">
        <p><span class="detail-label">Species:</span> {treeSpecies.scientificName}</p>
        <p><span class="detail-label">Location:</span> {tree.location.coordinates}</p>

        <!-- {#if tree.health}
            <div><span class="detail-label">Health:</span> {tree.health}</div>
        {/if} -->

        <!-- {#if tree.ageType}
            <div><span class="detail-label">Age Type:</span> {tree.ageType}</div>
        {/if} -->

        <!-- {#if tree.height !== undefined}
            <div><span class="detail-label">Height:</span> {tree.height} meters</div>
        {/if} -->

        {#if tree.datePlanted}
            <div><span class="detail-label">Planted:</span> {tree.datePlanted}</div>
        {/if}
        <!-- 
        {#if tree.}
            <div>
                <span class="detail-label">Description:</span>
                <p class="detail-description">{tree.description}</p>
            </div>
        {/if} -->
    </div>

    <a href="/app/search" class="back-link">← Back to Search</a>
</div>

<!-- <p class="mt-6 text-center text-gray-500">Tree not found.</p> -->
