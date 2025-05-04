<script lang="ts">
    import DesktopNavBar from "./DesktopNavBar.svelte";

    let { children } = $props();

    let dWideNav = $state(false);

    function dWideNavStyle() {
        return dWideNav ? "w-72" : "w-nav-h";
    }
</script>

<div class="hidden md:flex">
    <div class="h-svh transition-all {dWideNavStyle()}">
        <DesktopNavBar
            dWideNavCallback={() => {
                dWideNav = !dWideNav;
            }}
        />
    </div>
    <main class="px-def h-svh w-full overflow-y-scroll">
        {@render children()}
    </main>
</div>

<div class="md:hidden">
    <main>
        {@render children()}
    </main>
    <div class="h-nav-h fixed bottom-0 w-full"></div>
</div>
