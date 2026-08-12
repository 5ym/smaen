<script lang="ts">
import '../app.css';

let { children } = $props();
</script>

<svelte:head>
	<title>スマートエンカウント</title>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<header class="navbar bg-base-200 shadow-sm">
		<a href="/" class="btn btn-ghost">
			<img src="/logo.png" alt="スマートエンカウント" class="h-8" />
		</a>
	</header>

	<main class="mx-auto w-full max-w-xl grow p-4">
		{@render children()}
	</main>

	<footer class="footer footer-center bg-base-200 p-2 text-xs text-base-content/60">
		<span>©HeartRails Express</span>
	</footer>
</div>
