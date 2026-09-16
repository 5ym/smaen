<script lang="ts">
let { data } = $props();
</script>

<div class="stack">
	<div class="panel body center">
		<p class="lead">
			集合場所は <strong>{data.result}</strong> です
		</p>
	</div>

	{#each [data.wayFromFirst, data.wayFromSecond] as way, index (index)}
		<div class="panel body">
			<h2>{way[0]}から集合場所までの経路</h2>
			<ul class="route">
				{#each way as station (station)}
					<li class:here={station === data.result}>
						{station}
					</li>
				{/each}
			</ul>
		</div>
	{/each}

	<a href="/" class="button ghost back">もう一度検索する</a>
</div>

<style>
.panel.center {
	align-items: center;
}
.lead {
	font-size: 1.125rem;
}
.lead strong {
	color: var(--pico-primary);
	font-size: 1.5rem;
}
h2 {
	font-size: 1rem;
}

/* ---- 経路。丸を縦につないで並べる ---- */
.route {
	display: flex;
	flex-direction: column;
	margin: 0;
	padding: 0;
	list-style: none;
	counter-reset: route-step;
}
.route li {
	position: relative;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.35rem 0;
	font-size: 0.925rem;
}
/* 丸。中の数字は何番目の駅か */
.route li::before {
	content: counter(route-step);
	counter-increment: route-step;
	position: relative;
	z-index: 1; /* 下の縦線より手前に置く */
	display: flex;
	flex: none;
	align-items: center;
	justify-content: center;
	width: 2rem;
	height: 2rem;
	border-radius: 999px;
	background: var(--ui-base-300);
	color: var(--pico-color);
	font-size: 0.8rem;
}
/*
 * ひとつ上の丸とつなぐ縦線。先頭の駅には要らないので隣接で書く。
 * 丸の中心どうしを結ぶために、自分の高さの半分だけ上へ伸ばす
 */
.route li + li::after {
	content: "";
	position: absolute;
	top: -50%;
	left: calc(1rem - 1px);
	width: 2px;
	height: 100%;
	background: var(--ui-base-300);
}
/* 集合場所の駅だけ目立たせる */
.route li.here {
	font-weight: 700;
}
.route li.here::before {
	background: var(--pico-primary-background);
	color: var(--pico-primary-inverse);
}

.back {
	align-self: center;
}
</style>
