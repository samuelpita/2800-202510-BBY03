<script module>
    export function processHTMLPopUp(tree: ExtTreeDocumentStr) {
        const div = document.createElement("div");
        const commonName = div.appendChild(document.createElement("h3"));
        const scientificName = div.appendChild(document.createElement("p"));
        const datePlanted = div.appendChild(document.createElement("p"));
        const link = div.appendChild(document.createElement("a"));

        div.className = "min-w-3xs *:not-last:mb-2";
        commonName.className = "text-2xl capitalize";
        scientificName.className = "italic capitalize";
        link.className = "";

        commonName.textContent = tree.speciesInfo.commonName.toLowerCase();
        scientificName.textContent = tree.speciesInfo.scientificName.toLowerCase();
        datePlanted.textContent = tree.datePlanted ? tree.datePlanted.toString() : "Unknown";

        link.href = `/app/tree/${tree._id}`;
        link.textContent = "About this tree";

        return div;
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";
    import type { ExtTreeDocumentStr } from "$lib/server/db/colTrees";
    import type * as Leaflet from "leaflet";
    import "leaflet/dist/leaflet.css";
    import "leaflet-geosearch/dist/geosearch.css";
    import "leaflet.markercluster/dist/MarkerCluster.css";
    import "leaflet.markercluster/dist/MarkerCluster.Default.css";

    let { trees, className }: { trees?: ExtTreeDocumentStr[]; className?: string } = $props();

    let mapDiv: HTMLDivElement;
    let map: Leaflet.Map;

    onMount(async () => {
        //#region Imports
        const L = (await import("leaflet")).default;
        const GeoSearch = await import("leaflet-geosearch");
        await import("leaflet.markercluster");
        //#endregion

        // Setup map
        map = L.map(mapDiv).setView([49.2487, -122.9875], 13);

        // Setup the theme depending on the browser's theme
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
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

        // Setup search
        const search = GeoSearch.GeoSearchControl({
            provider: new GeoSearch.OpenStreetMapProvider(),
        });

        map.addControl(search);

        // Setup clusters
        if (trees) {
            const clusters = L.markerClusterGroup();

            trees.forEach((tree) => {
                const [long, lat] = tree.location.coordinates;
                clusters.addLayer(L.marker([lat, long]).bindPopup(processHTMLPopUp(tree)));
            });

            map.addLayer(clusters);
        }
    });
</script>

<div bind:this={mapDiv} class={className}></div>
