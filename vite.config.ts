import adapter from "@sveltejs/adapter-bun";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // SvelteKit の設定もここに置く (3 から `svelte.config.*` は読まれない)
    sveltekit({
      preprocess: vitePreprocess(),
      // 出力は `bun ./build` で動かす (bun:sqlite を使うので bun 前提)
      adapter: adapter(),
    }),
  ],
  css: {
    preprocessorOptions: { scss: { silenceDeprecations: ["if-function"] } },
  },
  ssr: {
    external: ["bun:sqlite"],
  },
});
