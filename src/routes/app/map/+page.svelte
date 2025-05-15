<script lang="ts">
  import { onMount } from 'svelte';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet.markercluster/dist/MarkerCluster.css';
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

  export let data: {
    trees: Array<{
      _id: string;
      location: { coordinates: [number, number] };
      datePlanted?: string | null;
      treeSpeciesId?: string;
    }>;
  };

  let mapDiv: HTMLDivElement;

  onMount(async () => {
    // 1) Dynamically import Leaflet core
    const L = (await import('leaflet')).default;
    // 2) Dynamically import the cluster plugin (it augments L)
    await import('leaflet.markercluster');

    // 3) Initialize map centered on Vancouver
    const map = L.map(mapDiv).setView([49.25, -123.1], 12);

    // 4) Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // 5) Create a MarkerClusterGroup
    const clusters = L.markerClusterGroup();

    // 6) Add each tree as a marker
    for (const tree of data.trees) {
      const [lng, lat] = tree.location.coordinates;
      const marker = L.marker([lat, lng]).bindPopup(`
        <div style="min-width:150px">
          <strong>ID:</strong> ${tree._id}<br/>
          <strong>Species:</strong> ${tree.treeSpeciesId ?? 'N/A'}<br/>
          <strong>Planted:</strong> ${tree.datePlanted ?? 'Unknown'}
        </div>
      `);
      clusters.addLayer(marker);
    }

    // 7) Add the cluster group to the map
    map.addLayer(clusters);
  });
</script>

<!-- 
  8) Make sure the container has height in your CSS.
     Here I use Tailwind's full-screen height;
     you can also use a fixed h-[600px] if you prefer.
-->
<div bind:this={mapDiv} class="w-full h-screen rounded-xl shadow-lg overflow-hidden"></div>
