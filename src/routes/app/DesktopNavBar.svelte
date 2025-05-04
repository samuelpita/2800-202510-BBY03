<script lang="ts">
    import type { MouseEventHandler } from "svelte/elements";

    let { dWideNavCallback }: { dWideNavCallback: MouseEventHandler<HTMLButtonElement> } = $props();
</script>

<div class="bg-light-2 dark:bg-dark-2 size-full">
    <button onclick={dWideNavCallback} class="size-nav">
        <img src="https://dummyimage.com/64x64/000/fff" alt="" />
    </button>
</div>
