import { mdsvex } from "mdsvex";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "@sveltejs/adapter-node";

const config = {
    preprocess: [vitePreprocess(), mdsvex()],
    kit: { adapter: adapter() },
    extensions: [".svelte", ".svx"],
};

export default config;
