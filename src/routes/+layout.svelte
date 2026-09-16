<script lang="ts">
import '../app.scss';

let { children } = $props();
</script>

<svelte:head>
	<title>スマートエンカウント</title>
</svelte:head>

<div class="shell">
	<header>
		<a href="/" class="button ghost">
			<img src="/logo.png" alt="スマートエンカウント" />
		</a>
	</header>

	<main class="page">
		{@render children()}
	</main>

	<footer>
		<span>©HeartRails Express</span>
	</footer>
</div>

<style>
/* 画面の高さいっぱいに広げて、footer を下端に置く */
.shell {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}
header {
	display: flex;
	align-items: center;
	min-height: 4rem;
	background: var(--ui-base-200);
	padding: 0.5rem;
	box-shadow: var(--ui-shadow);
}
header img {
	height: 2rem;
}
main {
	flex: 1 1 auto;
	padding-block: 1rem;
}
footer {
	background: var(--ui-base-200);
	padding: 0.5rem;
	color: var(--ui-muted);
	font-size: 0.75rem;
	text-align: center;
}
</style>
