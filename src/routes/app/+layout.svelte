<script lang="ts">
    import DesktopNavBar from "./DesktopNavBar.svelte";
    import MobileNavBar from "./MobileNavBar.svelte";

    let { children } = $props();
</script>

<!-- Desktop Layout -->
<div class="hidden md:flex">
    <DesktopNavBar />
    <main class="h-svh w-full overflow-y-scroll">
        {@render children()}
    </main>
</div>

<!-- Mobile Layout -->
<div class="md:hidden">
    <main>
        {@render children()}
    </main>
    <MobileNavBar />
</div>
