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
      treeSpeciesId: string;
      commonName: string;
      scientificName: string;
    }>;
  };

  let mapDiv: HTMLDivElement;

  onMount(async () => {
    const L = (await import('leaflet')).default;
    await import('leaflet.markercluster');

    const map = L.map(mapDiv).setView([49.25, -123.1], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const clusters = L.markerClusterGroup();

    data.trees.forEach(tree => {
      const [lng, lat] = tree.location.coordinates;
      const popup = `
        <div style="min-width:200px">
          <strong>${tree.commonName}</strong><br/>
          <em>${tree.scientificName}</em><br/>
          <small>ID: ${tree._id}</small><br/>
          <small>Planted: ${tree.datePlanted ?? 'Unknown'}</small><br/>
          <button class="adopt-btn" style="
            margin-top:6px;
            padding:4px 8px;
            background:#28a745;
            color:#fff;
            border:none;
            border-radius:3px;
            cursor:pointer;
          ">Adopt</button>
        </div>
      `;
      clusters.addLayer(L.marker([lat, lng]).bindPopup(popup));
    });

    map.addLayer(clusters);

    // hook up adopt button alerts
    map.on('popupopen', (e: any) => {
      const btn = e.popup.getElement().querySelector('.adopt-btn');
      btn?.addEventListener('click', () => {
        alert(`🌱 You have adopted a ${btn.closest('div').querySelector('strong').textContent}!`);
      });
    });
  });
</script>

<div bind:this={mapDiv} class="w-full h-screen rounded-xl shadow-lg overflow-hidden"></div>
