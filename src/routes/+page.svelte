<script lang="ts">
import { goto } from '$app/navigation';
import { page } from '$app/state';

let { data } = $props();

let yourStation = $state('');
let partnerStation = $state(page.url.searchParams.get('current_station') ?? '');
let locating = $state(true);
let canShare = $state(false);

$effect(() => {
	canShare = typeof navigator !== 'undefined' && 'share' in navigator;
	if (!navigator.geolocation) {
		locating = false;
		return;
	}
	navigator.geolocation.getCurrentPosition(
		async (position) => {
			try {
				const res = await fetch(
					`/api/nearest?x=${position.coords.longitude}&y=${position.coords.latitude}`,
				);
				const nearest = await res.json();
				const name = nearest?.response?.station?.[0]?.name;
				if (name && yourStation === '') {
					yourStation = name;
				}
			} finally {
				locating = false;
			}
		},
		() => {
			locating = false;
		},
	);
});

function search(event: SubmitEvent) {
	event.preventDefault();
	if (yourStation === '' || partnerStation === '') return;
	goto(
		`/result?first=${encodeURIComponent(yourStation)}&second=${encodeURIComponent(partnerStation)}`,
	);
}

function shareLink() {
	navigator.share({
		title: 'スマートエンカウント',
		url: `${page.url.origin}?current_station=${encodeURIComponent(yourStation)}`,
	});
}
</script>

<form onsubmit={search} class="panel body">
	<h1>ふたりの中間の駅で待ち合わせ</h1>

	<label class="field">
		<span class="lab cluster">
			あなたの駅
			{#if locating}
				<span class="spin"></span>
				<span class="tiny muted">現在地から検索中…</span>
			{/if}
		</span>
		<input type="text" bind:value={yourStation} list="stations" placeholder="例: 新宿" />
	</label>

	<label class="field">
		<span class="lab">あいての駅</span>
		<input type="text" bind:value={partnerStation} list="stations" placeholder="例: 大宮" />
	</label>

	<datalist id="stations">
		{#each data.stations as station (station)}
			<option value={station}></option>
		{/each}
	</datalist>

	<div class="cluster actions">
		<button type="submit" disabled={yourStation === '' || partnerStation === ''}>
			検索
		</button>
		{#if canShare}
			<button type="button" class="secondary" onclick={shareLink} disabled={yourStation === ''}>
				相手にリンクを共有
			</button>
		{/if}
	</div>
</form>

<style>
/* 元の card-body gap-4 と同じ間隔 */
.panel.body {
	gap: 1rem;
}
h1 {
	font-size: 1.25rem;
}
/* .lab は太字だが、ラベル脇の状況表示まで太くしない */
.lab .tiny {
	font-weight: 400;
}
.actions {
	justify-content: center;
}
</style>
