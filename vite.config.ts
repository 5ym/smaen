import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		// SvelteKit の設定もここに置く (3 から `svelte.config.*` は読まれない)
		sveltekit({
			preprocess: vitePreprocess(),
			// 出力は `bun ./build/index.js` で動かす (bun:sqlite を使うので bun 前提)
			adapter: adapter(),
		}),
	],
	css: {
		preprocessorOptions: { scss: { silenceDeprecations: ['if-function'] } },
	},
	ssr: {
		external: ['bun:sqlite'],
	},
});
