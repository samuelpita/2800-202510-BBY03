<script lang="ts">
    import type { PageProps } from "./$types";

    const { data }: PageProps = $props();
</script>

<h1>Account</h1>

<!-- Example of a if/else block in Svelte. Pretty cool shit. -->
{#if data.user}
    <h1>Hi {data.user.username}</h1>
{:else}
    <h1>You're not signed in.</h1>
{/if}

<a href="/app/logout">Log out</a>
