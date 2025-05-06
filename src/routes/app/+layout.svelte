<script lang="ts">
    import DesktopNavBar from "./DesktopNavBar.svelte";
    import MobileNavBar from "./MobileNavBar.svelte";

    let { children } = $props();
</script>

<div class="md:flex">
    <div class="hidden h-svh md:flex">
        <DesktopNavBar />
    </div>

    <main class="h-[calc(100svh-var(--spacing-nav))] w-full overflow-y-scroll md:h-svh">
        {@render children()}
    </main>

    <div class="md:hidden">
        <MobileNavBar />
    </div>
</div>
