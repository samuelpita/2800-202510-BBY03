<script lang="ts">
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<h1>App</h1>

<!-- Example of if/else statement on Svelte HTML -->
{#if data.user}
    <h1>Hi {data.user.username}</h1>
    <a href="/app/account">Account</a>
{:else}
    <h1>Welcome!</h1>
    <a href="/app/login">Log in</a>
    <a href="/app/register">Sign up</a>
{/if}
