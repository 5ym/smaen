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

<form onsubmit={search} class="card bg-base-100 shadow-md">
	<div class="card-body gap-4">
		<h1 class="card-title">ふたりの中間の駅で待ち合わせ</h1>

		<label class="form-control w-full">
			<span class="label-text mb-1 flex items-center gap-2">
				あなたの駅
				{#if locating}
					<span class="loading loading-spinner loading-xs"></span>
					<span class="text-xs text-base-content/60">現在地から検索中…</span>
				{/if}
			</span>
			<input
				type="text"
				bind:value={yourStation}
				list="stations"
				placeholder="例: 新宿"
				class="input input-bordered w-full"
			/>
		</label>

		<label class="form-control w-full">
			<span class="label-text mb-1">あいての駅</span>
			<input
				type="text"
				bind:value={partnerStation}
				list="stations"
				placeholder="例: 大宮"
				class="input input-bordered w-full"
			/>
		</label>

		<datalist id="stations">
			{#each data.stations as station (station)}
				<option value={station}></option>
			{/each}
		</datalist>

		<div class="card-actions justify-center">
			<button type="submit" class="btn btn-primary" disabled={yourStation === '' || partnerStation === ''}>
				検索
			</button>
			{#if canShare}
				<button type="button" class="btn btn-secondary" onclick={shareLink} disabled={yourStation === ''}>
					相手にリンクを共有
				</button>
			{/if}
		</div>
	</div>
</form>
