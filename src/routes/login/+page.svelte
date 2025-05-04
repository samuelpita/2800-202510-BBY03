<script lang="ts">
    import type { PageProps } from "./$types";

    let { form }: PageProps = $props();
</script>

<main class="my-def">
    <div class="p-def bg-light-2 dark:bg-dark-2 *:not-last:mb-def rounded-outer mx-auto max-w-xl">
        <a href="/" class="flex size-12">
            <img src="https://dummyimage.com/48x48/000/fff" alt="" />
        </a>

        <h1>Log in to Lorax</h1>

        {#if form?.incorrect}
            <p>Email address or password is incorrect!</p>
        {/if}

        <form method="post" class="*:not-last:mb-def">
            <label class="flex flex-col gap-2">
                <span>Email address *</span>
                <input
                    type="email"
                    name="email"
                    value={form?.email}
                    class="rounded-inner border p-2"
                />

                {#if form?.missing?.includes("email")}
                    <span class="text-red-500">You must fill out this field!</span>
                {/if}
            </label>
            <label class="flex flex-col gap-2">
                <span>Password *</span>
                <input type="password" name="password" class="rounded-inner border p-2" />

                {#if form?.missing?.includes("password")}
                    <span class="text-red-500">You must fill out this field!</span>
                {/if}
            </label>
            <button class="rounded-inner w-full border p-2">Log in</button>
        </form>

        <a href="/register">Create a new account</a>
    </div>
</main>
