<script lang="ts">
    import LandingFooter from "./LandingFooter.svelte";
    import LandingNavBar from "./LandingNavBar.svelte";
</script>

<LandingNavBar />

<main class="my-def *:not-last:mb-def">
    <header>
        <div class="mb-def px-def mx-auto max-w-4xl">
            <h1>Lorax</h1>
            <h5>designed for tree lovers, and those who speak for the trees</h5>
        </div>

        <img src="https://dummyimage.com/1000x1000/000/fff" alt="" class="block w-full md:hidden" />
        <img src="https://dummyimage.com/1280x320/000/fff" alt="" class="hidden w-full md:block" />
    </header>

    <section class="px-def mx-auto max-w-4xl">
        <h3>Mission</h3>
        <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus sint exercitationem
            animi vel, voluptas veniam numquam rem labore culpa fugiat harum quia qui. Repellendus
            reiciendis nihil voluptas eveniet, mollitia accusamus!
        </p>
    </section>

    <div class="px-def *:not-last:mb-def mx-auto max-w-4xl">
        <section class="gap-def flex-info-order flex">
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

        <section class="gap-def flex-info-order flex">
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

        <section class="gap-def flex-info-order flex">
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
