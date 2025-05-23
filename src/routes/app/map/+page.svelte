<script lang="ts">
    import Map from "./Map.svelte";
    let { data } = $props();
</script>

<Map trees={data.trees} className="h-svh w-full"></Map>
