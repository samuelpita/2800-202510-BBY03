<script lang="ts">
    import DesktopNavBar from "./DesktopNavBar.svelte";
    import MobileNavBar from "./MobileNavBar.svelte";

    let { children } = $props();
</script>

<!-- Desktop Layout -->
<div class="hidden md:flex">
    <DesktopNavBar />
    <main class="p-edge-d h-svh w-full overflow-y-scroll">
        {@render children()}
    </main>
</div>

<!-- Mobile Layout -->
<div class="md:hidden">
    <main class="p-edge-m">
        {@render children()}
    </main>
    <MobileNavBar />
</div>
