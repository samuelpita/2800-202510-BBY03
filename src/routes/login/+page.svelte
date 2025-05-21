<script lang="ts">
    import type { PageProps } from "./$types";

    let { form }: PageProps = $props();
</script>

<main class="my-edge-d">
    <div
        class="p-edge-d bg-light-2 dark:bg-dark-2 *:not-last:mb-edge-d rounded-outer mx-auto max-w-xl"
    >
        <a href="/" class="inline-block size-12">
            <img src="https://dummyimage.com/48x48/000/fff" alt="" />
        </a>

        <h1 class="text-4xl">Log in to <span class="text-accent font-bold">Lorax</span></h1>

        {#if form?.incorrect}
            <p class="text-error">Email address or password is incorrect!</p>
        {/if}

        <form method="post" class="*:not-last:mb-edge-d">
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

        <a href="/register" class="text-link">Create a new account</a>
    </div>
</main>
