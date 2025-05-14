<script lang="ts">
    let { data } = $props();
</script>

<div class="px-edge-m pt-edge-m mx-auto max-w-2xl *:mb-8">
    <div class="">
        <h1>{data.guide.title}</h1>
        <p class="italic">by {data.author}</p>
        <p class="italic">Posted {data.guide.dateCreated.toDateString()}</p>
        <!-- {#if data.guide.dateUpdated}
            <p>Updated {data.guide.dateUpdated.toDateString()}</p>
        {/if} -->
    </div>

    <a href="/app/species/{data.speciesInfo._id}" class="flex items-center gap-4 rounded border p-4">
        <img src="/icons/tree.svg" alt="" class="size-16 dark:invert" />
        <div>
            <h3 class="capitalize">{data.speciesInfo.commonName.toLowerCase()}</h3>
            <p class="capitalize">{data.speciesInfo.scientificName.toLowerCase()}</p>
        </div>
    </a>

    <article>
        {@html data.guide.content}
    </article>
</div>
