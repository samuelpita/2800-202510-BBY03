<script lang="ts">
    import LandingFooter from "./LandingFooter.svelte";
    import LandingNavBar from "./LandingNavBar.svelte";
</script>

<LandingNavBar />

<main class="my-edge-d *:not-last:mb-edge-d">
    <header>
        <div class="mb-edge-d px-edge-d mx-auto max-w-4xl *:not-last:mb-2">
            <h1>
                <img src="/lorax-logo.png" alt="" class="w-[128px] h-[96px] inline" />
                <span class="align-middle text-7xl font-['Amaranth']"><i>Lorax</i></span>
            </h1>
            <h5>"Designed for tree lovers, and those who speak for the trees."</h5>
        </div>

        <img src="/person-hugging-tree.jpg" alt="" class="w-full mask-b-from-80% mask-t-from-80%" />
    </header>

    <section class="px-edge-d mx-auto max-w-4xl">
        <h3>Our Mission</h3>
        <p>
            We want to unite our community in a way that can also give back to the environment,
            that's what Lorax strives to achieve. Lorax provides easy to use plant care and
            tree adoption tools, allowing users to learn how to care for the environment while
            adding a sense of community building and routineness.
        </p>
    </section>

    <div class="px-edge-d *:not-last:mb-edge-d mx-auto max-w-4xl">
        <section class="gap-edge-d flex-info-order flex">
            <img src="/gathered-around-tree.jpg" alt="" class="w-full mask-l-from-80% mask-r-from-80%" />
            
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
