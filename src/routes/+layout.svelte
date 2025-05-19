<script lang="ts">
    import "../app.css";
    import { page } from '$app/stores';
    import Weather from "$lib/components/Weather.svelte";
    let { children } = $props();
</script>

<!-- Header bar for weather (top-right) -->
{#if $page.url.pathname !== '/'}
    <div class="absolute top-4 right-4 z-50">
        <Weather />
    </div>
{/if}

<!-- Main page content -->
{@render children()}
