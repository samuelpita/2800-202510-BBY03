<script lang="ts">
    import type { PageProps } from "./$types";

    let { form }: PageProps = $props();
</script>

<main class="my-edge-d">
    <div
        class="p-edge-d bg-light-2 dark:bg-dark-2 *:not-last:mb-edge-d rounded-outer mx-auto max-w-xl"
    >

        <h1 class="text-4xl">Sign up for <span class="text-accent font-bold">Lorax</span></h1>

        {#if form?.serverIssue}
            <p class="text-error">
                Something's wrong with Lorax's servers. Consider registering next time!
            </p>
        {/if}

        <form method="post" class="*:not-last:mb-edge-d">
            <!-- Email -->
            <label class="flex flex-col gap-2">
                <span>Email address *</span>
                <input
                    type="email"
                    name="email"
                    value={form?.email}
                    class="rounded-inner border p-2"
                />

                {#if form?.missing?.includes("email")}
                    <span class="text-error">You must fill out this field!</span>
                {/if}

                {#if form?.possibleDuplicate}
                    <span class="text-error">The user of this email already exists!</span>
                {/if}
            </label>

            <!-- Username -->
            <label class="flex flex-col gap-2">
                <span>Username *</span>
                <input
                    type="text"
                    name="username"
                    value={form?.username}
                    class="rounded-inner border p-2"
                />

                {#if form?.missing?.includes("username")}
                    <span class="text-error">You must fill out this field!</span>
                {/if}
            </label>

            <!-- Password -->
            <label class="flex flex-col gap-2">
                <span>Password *</span>
                <input type="password" name="password" class="rounded-inner border p-2" />

                {#if form?.missing?.includes("password")}
                    <span class="text-error">You must fill out this field!</span>
                {/if}
            </label>

            <!-- Confirm Password -->
            <label class="flex flex-col gap-2">
                <span>Confirm password *</span>
                <input type="password" name="passwordConfirm" class="rounded-inner border p-2" />

                {#if form?.missing?.includes("username")}
                    <span class="text-error">You must fill out this field!</span>
                {/if}

                {#if form?.nonMatchingPasswords}
                    <span class="text-error">Password fields must match!</span>
                {/if}
            </label>

            <button class="rounded-inner w-full border p-2">Register</button>
        </form>

        <a href="/login" class="text-link">I already have an account!</a>
        <a href="/" class="text-link float-right">Home</a>
    </div>
</main>
