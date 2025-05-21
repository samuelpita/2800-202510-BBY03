<script lang="ts">
    import LandingFooter from "./LandingFooter.svelte";
    import LandingNavBar from "./LandingNavBar.svelte";
</script>

<LandingNavBar />

<main class="my-edge-d *:not-last:mb-edge-d">
    <!-- Header Section -->
    <header>
        <div class="mb-edge-d px-edge-d mx-auto max-w-4xl *:not-last:mb-2">
            <h1 class="text-4xl font-bold flex items-center gap-2 ml-10">
                <img src="/logo.png" alt="Lorax Logo" class="w-[128px] h-[128px]" />
                <span class="text-5xl">Lorax</span>
            </h1>
            <h5 class="text-lg text-neutral-700 text-center"><i>Designed for tree lovers, and those who speak for the trees</i></h5>
        </div>

        <img src="/header1.jpg" alt="Lorax forest header" class="block w-full md:hidden" />
        <img src="/header1.jpg" alt="Lorax forest header" class="hidden w-full md:block" />
    </header>

    <!-- Mission Section -->
    <section class="px-edge-d mx-auto max-w-4xl text-center">
        <h3 class="text-3xl font-semibold mb-2">Our Mission</h3>
        <p class="text-lg text-neutral-800">
            Lorax empowers individuals to connect with and care for urban trees. Our mission is to promote environmental awareness, encourage community participation, and make it easy for everyone to adopt and protect green life in their neighborhood.
        </p>
    </section>

    <!-- Features Section -->
    <div class="px-edge-d *:not-last:mb-edge-d mx-auto max-w-4xl">

        <!-- Feature 1: Adopt a Tree -->
        <section class="gap-edge-d flex-info-order flex items-center">
            <img
                src="https://pics.clipartpng.com/Cartoon_Tree_PNG_Clip_Art-1092.png"
                alt="Adopt a Tree"
                class="w-1/2 md:w-1/2 rounded-lg"
            />
            <div class="my-auto w-full md:w-1/2 px-4">
                <h3 class="text-2xl font-bold mb-2">Adopt a Tree</h3>
                <p>
                    Browse a curated map of nearby trees and choose one to adopt. You'll gain access to its profile, care needs, and updates — becoming its personal guardian.
                </p>
            </div>
        </section>

        <!-- Feature 2: Set Reminders -->
        <section class="gap-edge-d flex-info-order flex items-center flex-row-reverse">
            <img
                src="https://static.vecteezy.com/system/resources/previews/013/363/745/original/watering-plants-3d-rendering-isometric-icon-png.png"
                alt="Care Reminders"
                class="w-1/2 md:w-1/2 rounded-lg"
            />
            <div class="my-auto w-full md:w-1/2 px-4">
                <h3 class="text-2xl font-bold mb-2">Care Reminders</h3>
                <p>
                    Never miss a watering day again. With built-in reminders, Lorax ensures your adopted tree receives the care it deserves — on time, every time.
                </p>
            </div>
        </section>

        <!-- Feature 3: Track Growth -->
        <section class="gap-edge-d flex-info-order flex items-center">
            <img
                src="/tree-growth.png"
                alt="Track Growth"
                class="w-3/2 md:w-1/2 rounded-lg"
            />
            <div class="my-auto w-full md:w-1/2 px-4">
                <h3 class="text-2xl font-bold mb-2">📈 Track Growth</h3>
                <p>
                    Monitor your tree's progress with visual growth tracking and logs. Upload photos, write notes, and feel proud watching it flourish under your care.
                </p>
            </div>
        </section>
    </div>
</main>

<LandingFooter />
