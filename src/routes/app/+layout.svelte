<script lang="ts">
    import DesktopNavBar from "./DesktopNavBar.svelte";

    let { children } = $props();

    let dWideNav = $state(false);

    function dWideNavStyle() {
        return dWideNav ? "w-72" : "w-nav";
    }
</script>

<!-- Desktop Layout -->
<div class="hidden md:flex">
    <div class="h-svh transition-all {dWideNavStyle()}">
        <DesktopNavBar
            dWideNavCallback={() => {
                dWideNav = !dWideNav;
            }}
        />
    </div>
    <main class="px-edge-d h-svh w-full overflow-y-scroll">
        {@render children()}
    </main>
</div>

<!-- Mobile Layout -->
<div class="md:hidden">
    <main class="my-edge-d px-edge-m">
        {@render children()}
    </main>
    <div class="h-nav"></div>
    <div class="h-nav bg-dark-2 fixed bottom-0 w-full"></div>
</div>
