<script lang="ts">
    import { isDarkMode } from "$lib";
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";
    import type * as Leaflet from "leaflet";
    import "leaflet-geosearch/dist/geosearch.css";
    import "leaflet/dist/leaflet.css";

    let { data }: PageProps = $props();

    let mapDiv: HTMLDivElement;
    let map: Leaflet.Map;

    /*
        SSR (Server-Side Rendering) is a thing in SvelteKit. You can
        search that up.
        
        Leaflet, by design, works with the DOM, and because of that, you
        can't put all of the Leaflet-related functions outside of onMount.
        This is because Svelte compiles all of the .svelte stuff server-side,
        and the server doesn't have access to the client's browser,
        where all of the DOM magic reside in.

        If you ever have any issues, please contact me. ChatGPT may help, but
        I don't think it has a grasp on this framework in particular. Gemini
        does though.

        Finally, I will componentize Leaflet's functionalities, so it looks
        cleaner overall, and we can reuse the map in other pages where
        needed. For now though, they will stay here in onMount().

        Good luck
        -Sam
    */

    onMount(async () => {
        if (window !== undefined) {
            const L = (await import("leaflet")).default;
            const GeoSearch = await import("leaflet-geosearch");

            map = L.map(mapDiv).setView([49.2487, -122.9875], 13);

            if (isDarkMode()) {
                L.tileLayer(
                    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
                    {
                        maxZoom: 20,
                        attribution:
                            '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
                    },
                ).addTo(map);
            } else {
                L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(map);
            }

            const search = GeoSearch.GeoSearchControl({
                provider: new GeoSearch.OpenStreetMapProvider(),
            });

            map.addControl(search);
        }
    });
</script>

<div bind:this={mapDiv} class="size-full overflow-hidden"></div>
