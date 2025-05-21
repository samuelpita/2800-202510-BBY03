<!-- src/routes/app/guides/+page.svelte -->
<script lang="ts">
  export let data;
  let activeGuide = null;

  function showGuide(guide) {
    activeGuide = guide;
  }

  function goBack() {
    activeGuide = null;
  }
</script>

<div class="min-h-screen bg-orange-50 py-12 px-6">
  <div class="max-w-3xl mx-auto">
    {#if activeGuide}
      <div class="bg-white p-6 rounded-xl shadow">
        <button 
          on:click={goBack} 
          class="mb-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm">
          ← Back to Guide
        </button>
        <h2 class="text-2xl font-bold text-orange-700 mb-4">{activeGuide.name}</h2>
        <iframe 
          src={activeGuide.path} 
          title={`Info for ${activeGuide.name}`}
          class="w-full h-[600px] border rounded">
        </iframe>
      </div>
    {:else}
      <h1 class="text-4xl font-extrabold text-orange-700 mb-8 text-center">
        🌳 Vancouver Trees Guide 🌳
      </h1>
      <ul class="space-y-6">
        {#each data.guides as guide}
          <li class="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p class="text-lg font-semibold text-gray-800">{guide.name}</p>
            <button
              on:click={() => showGuide(guide)}
              class="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              ℹ️ More Info
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
