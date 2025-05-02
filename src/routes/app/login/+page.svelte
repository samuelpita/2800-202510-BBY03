<script lang="ts">
    import type { PageProps } from "./$types";

    let { form }: PageProps = $props();
</script>

<h1>Log in to Lorax</h1>

{#if form?.incorrect}
    <p>Email address or password is incorrect!</p>
{/if}

<form method="post" class="flex flex-col">
    <label>
        <span>Email address</span>
        <input type="email" name="email" value={form?.email} />

        {#if form?.missing?.includes("email")}
            <span>You must fill out this field!</span>
        {/if}
    </label>
    <label>
        <span>Password</span>
        <input type="password" name="password" />

        {#if form?.missing?.includes("password")}
            <span>You must fill out this field!</span>
        {/if}
    </label>
    <button>Log in</button>
</form>

<a href="/app/register">Create a new account</a>
