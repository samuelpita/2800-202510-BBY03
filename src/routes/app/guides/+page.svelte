<script lang="ts">
    let { data } = $props();
</script>

{#snippet guideCard(id: string, title: string, dateCreated: Date)}
    <a href="/app/guides/species/{id}">
        <div class="p-3 rounded border">
            <h3 class="text-xl font-bold">{title}</h3>
            <p>Posted in {dateCreated.toLocaleString()}</p>
        </div>
    </a>
{/snippet}

<div class="max-w-xl mx-auto p-edge-d *:not-last:mb-6">
    <h1 class="text-3xl font-bold">Guides</h1>

    {#each data.guides as guide}
        {@render guideCard(guide._id, guide.title, guide.dateCreated)}
    {/each}
</div>
