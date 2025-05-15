<script lang="ts">
  import { onMount } from 'svelte';
  import L from 'leaflet';
  import 'leaflet.markercluster';

  // Fix for default marker icons in many bundlers:
  import iconUrl from 'leaflet/dist/images/marker-icon.png';
  import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
  import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
  L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl });

  let mapContainer: HTMLDivElement;

  onMount(async () => {
    // 1) Fetch your JSON (make sure trees.json is in static/)
    const res = await fetch('/trees.json');
    const trees: { latitude: number; longitude: number; species?: string; _id?: string }[] = await res.json();

    // 2) Initialize the map
    const map = L.map(mapContainer).setView([49.2827, -123.1207], 12); // Vancouver center

    // 3) Add a tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 4) Create the marker cluster group
    const markers = L.markerClusterGroup({
      // optional settings:
      chunkedLoading: true,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true
    });

    // 5) Add each tree as a marker
    trees.forEach(tree => {
      const m = L.marker([tree.latitude, tree.longitude]);
      m.bindPopup(`<strong>Species:</strong> ${tree.species || 'Unknown'}<br><strong>ID:</strong> ${tree._id || '—'}`);
      markers.addLayer(m);
    });

    // 6) Add the cluster layer to the map
    map.addLayer(markers);

    // (Optional) Fit map to your data bounds:
    const group = L.featureGroup(
      trees.map(t => L.marker([t.latitude, t.longitude]))
    );
    map.fitBounds(group.getBounds().pad(0.1));
  });
</script>

<style>
  /* full‐screen map container */
  #map { width: 100%; height: 100vh; }
</style>

<div bind:this={mapContainer} id="map"></div>
