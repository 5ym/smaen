<script lang="ts">
let { data } = $props();
</script>

<div class="flex flex-col gap-4">
	<div class="card bg-base-100 shadow-md">
		<div class="card-body items-center">
			<p class="text-lg">
				集合場所は <strong class="text-2xl text-primary">{data.result}</strong> です
			</p>
		</div>
	</div>

	{#each [data.wayFromFirst, data.wayFromSecond] as way, index (index)}
		<div class="card bg-base-100 shadow-md">
			<div class="card-body">
				<h2 class="card-title text-base">{way[0]}から集合場所までの経路</h2>
				<ul class="steps steps-vertical">
					{#each way as station (station)}
						<li class="step" class:step-primary={station === data.result}>
							{station}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/each}

	<a href="/" class="btn btn-ghost self-center">もう一度検索する</a>
</div>
