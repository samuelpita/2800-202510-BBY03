<script lang="ts">
    import { compile } from "mdsvex";

    let { data } = $props();
</script>

<div class="px-edge-m pt-edge-m mx-auto max-w-2xl *:not-last:mb-8">
    <div class="">
        <h3>{data.guide.title}</h3>
        <p class="italic">by {data.author}</p>
    </div>

    <div class="flex items-center gap-4 rounded border p-4">
        <img src="/icons/tree.svg" alt="" class="size-16 dark:invert" />
        <a href="/app/tree/{data.speciesInfo._id}">
            <h4 class="capitalize">{data.speciesInfo.commonName.toLowerCase()}</h4>
            <p class="capitalize">{data.speciesInfo.scientificName.toLowerCase()}</p>
        </a>
    </div>

    <article class="*:not-last:mb-2">
        {@html data.guide.content}
    </article>
</div>
