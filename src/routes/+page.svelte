<script lang="ts">
    import LandingFooter from "./LandingFooter.svelte";
    import LandingNavBar from "./LandingNavBar.svelte";
</script>

<LandingNavBar />

<main class="my-edge-d *:not-last:mb-edge-d">
    <header>
        <div class="mb-edge-d px-edge-d mx-auto max-w-4xl *:not-last:mb-2">
            <h1>
                <img src="https://dummyimage.com/128x128/000/fff" alt="" class="size-nav inline" />
                <span class="align-middle">Lorax</span>
            </h1>
            <h5>designed for tree lovers, and those who speak for the trees</h5>
        </div>

        <img src="https://dummyimage.com/1000x1000/000/fff" alt="" class="block w-full md:hidden" />
        <img src="https://dummyimage.com/1280x320/000/fff" alt="" class="hidden w-full md:block" />
    </header>

    <section class="px-edge-d mx-auto max-w-4xl">
        <h3>Mission</h3>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus sint exercitationem
            animi vel, voluptas veniam numquam rem labore culpa fugiat harum quia qui. Repellendus
            reiciendis nihil voluptas eveniet, mollitia accusamus!
        </p>
    </section>

    <div class="px-edge-d *:not-last:mb-edge-d mx-auto max-w-4xl">
        <section class="gap-edge-d flex-info-order flex">
            <img
                src="https://dummyimage.com/1000x1000/000/fff"
                alt=""
                class="w-full object-cover"
            />
            <div class="my-auto w-full">
                <h3>Feature 1</h3>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus sint
                    exercitationem animi vel, voluptas veniam numquam rem labore culpa fugiat harum
                    quia qui. Repellendus reiciendis nihil voluptas eveniet, mollitia accusamus!
                </p>
            </div>
        </section>

        <section class="gap-edge-d flex-info-order flex">
            <img
                src="https://dummyimage.com/1000x1000/000/fff"
                alt=""
                class="w-full object-cover"
            />
            <div class="my-auto w-full">
                <h3>Feature 2</h3>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus sint
                    exercitationem animi vel, voluptas veniam numquam rem labore culpa fugiat harum
                    quia qui. Repellendus reiciendis nihil voluptas eveniet, mollitia accusamus!
                </p>
            </div>
        </section>

        <section class="gap-edge-d flex-info-order flex">
            <img
                src="https://dummyimage.com/1000x1000/000/fff"
                alt=""
                class="w-full object-cover"
            />
            <div class="my-auto w-full">
                <h3>Feature 3</h3>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus sint
                    exercitationem animi vel, voluptas veniam numquam rem labore culpa fugiat harum
                    quia qui. Repellendus reiciendis nihil voluptas eveniet, mollitia accusamus!
                </p>
            </div>
        </section>
    </div>
</main>

<LandingFooter />
