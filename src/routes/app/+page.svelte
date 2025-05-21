<script lang="ts">
  import { TreePine, Bell, BarChart3, Sprout } from 'lucide-svelte';
</script>

<div class="p-edge-d mx-auto max-w-4xl">
    <!-- Lorax Mission-Based Content -->

    <section class="text-center">
        <h1 class="text-4xl font-bold mb-2">Welcome to Lorax</h1>
        <p class="mb-4">
            Lorax is your neighborhood companion for preserving urban nature. Adopt a local tree, track its health, and make a lasting impact on your community’s ecosystem.
        </p>
        <!-- <Sprout class="w-16 h-16 text-green-600" /> -->
    </section>

    <section class="text-center">
        <h3 class="text-2xl font-semibold mt-10 mb-2">🌳 Adopt a Tree</h3>
        <p class="mb-4">
            Browse trees in your area and choose one to adopt. Each tree comes with a profile showing its species, location, and health status.
        </p>
        <a href="/app/search"><button class="border-2 rounded-xl w-[128px] h-[48px] text-2xl hover:bg-[#614841]">Adopt</button></a>
        <!-- <TreePine class="w-16 h-16 text-green-500" /> -->
    </section>

    <section class="text-center">
        <h3 class="text-2xl font-semibold mt-10 mb-2">💧 Set Reminders</h3>
        <p class="mb-4">
            Stay connected to your tree with customizable watering and care reminders. Help it thrive with timely care.
        </p>
        <a href="/app"><button class="border-2 rounded-xl w-[196px] h-[48px] text-2xl hover:bg-[#614841]">Set Reminder</button></a>
        <!-- <Bell class="w-16 h-16 text-blue-500" /> -->
    </section>

    <section class="text-center">
        <h3 class="text-2xl font-semibold mt-10 mb-2">📊 Track Growth</h3>
        <p class="mb-4">
            Monitor your tree’s development over time with photos, notes, and a growth timeline. Watch your impact grow, one leaf at a time.
        </p>
        <a href="/app"><button class="border-2 rounded-xl w-[196px] h-[48px] text-2xl hover:bg-[#614841]">Start tracking</button></a>
        <!-- <BarChart3 class="w-16 h-16 text-yellow-500" /> -->
    </section>
</div>
