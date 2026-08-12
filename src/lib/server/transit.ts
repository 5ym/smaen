import { getCachedRoute, setCachedRoute } from './db';

export type StationTime = {
	name: string;
	time: string;
};

export type SearchResult = {
	result: string;
	wayFromFirst: string[];
	wayFromSecond: string[];
};

type EdgeInfo = {
	stationName: string;
	timeInfo: { time: string; type: number }[];
	stopStationList: {
		name: string;
		departureTime?: string;
		arrivalTime?: string;
	}[];
};

const USER_AGENT =
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

/**
 * Yahoo!乗換案内の検索結果ページから、経路上の駅と時刻の一覧を取り出す。
 * ページはNext.js製なので __NEXT_DATA__ のJSONを読む。
 */
export async function fetchStationList(
	from: string,
	to: string,
): Promise<StationTime[]> {
	const url = `https://transit.yahoo.co.jp/search/result?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
	const res = await fetch(url, { headers: { 'user-agent': USER_AGENT } });
	if (!res.ok) {
		throw new Error(`経路検索に失敗しました (${res.status})`);
	}
	const html = await res.text();
	const match = html.match(
		/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s,
	);
	if (!match) {
		throw new Error('経路情報が見つかりませんでした');
	}
	const data = JSON.parse(match[1]);
	const feature = data?.props?.pageProps?.naviSearchParam?.featureInfoList?.[0];
	const edges: EdgeInfo[] = feature?.edgeInfoList ?? [];
	if (edges.length === 0) {
		throw new Error(`「${from}」から「${to}」の経路が見つかりませんでした`);
	}

	const stations: StationTime[] = [];
	edges.forEach((edge, index) => {
		// type 2 = 到着時刻。なければ先頭の時刻(出発 or 単一)を使う
		const arrival = edge.timeInfo.find((t) => t.type === 2) ?? edge.timeInfo[0];
		stations.push({ name: edge.stationName, time: arrival?.time ?? '' });
		// 末尾の辺のstopStationListは直前の区間と同じ内容なので読まない
		if (index < edges.length - 1) {
			for (const stop of edge.stopStationList) {
				stations.push({
					name: stop.name,
					time: stop.arrivalTime ?? stop.departureTime ?? '',
				});
			}
		}
	});
	return stations;
}

function toMinutes(time: string): number | null {
	const match = time.match(/^(\d{1,2}):(\d{2})$/);
	if (!match) return null;
	return Number(match[1]) * 60 + Number(match[2]);
}

function timeDiff(a: string, b: string): number | null {
	const ma = toMinutes(a);
	const mb = toMinutes(b);
	if (ma === null || mb === null) return null;
	const diff = Math.abs(ma - mb);
	return Math.min(diff, 24 * 60 - diff);
}

/** 集合場所の駅名から先を切り落とした経路を返す */
function wayTo(stations: StationTime[], result: string): string[] {
	const way: string[] = [];
	for (const station of stations) {
		way.push(station.name);
		if (station.name === result) break;
	}
	return way;
}

/**
 * ふたりの現在駅から、到着時刻の差が最も小さい途中駅(=集合場所)を求める。
 */
export async function searchMeetingPoint(
	first: string,
	second: string,
): Promise<SearchResult> {
	const cacheKey = `${first}|${second}`;
	const cached = getCachedRoute<SearchResult>(cacheKey);
	if (cached) return cached;

	const [fromFirst, fromSecond] = await Promise.all([
		fetchStationList(first, second),
		fetchStationList(second, first),
	]);

	// 往路と復路で経路が違うことがあるので、両方の経路に現れる駅の中から
	// 到着時刻の差が最も小さい駅を選ぶ
	const secondTimes = new Map<string, string>();
	for (const station of fromSecond) {
		if (!secondTimes.has(station.name)) {
			secondTimes.set(station.name, station.time);
		}
	}

	let result = '';
	let bestDiff = Number.POSITIVE_INFINITY;
	for (const station of fromFirst) {
		const secondTime = secondTimes.get(station.name);
		if (secondTime === undefined) continue;
		const diff = timeDiff(station.time, secondTime);
		if (diff !== null && diff < bestDiff) {
			bestDiff = diff;
			result = station.name;
		}
	}
	if (result === '') {
		throw new Error('集合場所を計算できませんでした');
	}

	const searchResult: SearchResult = {
		result,
		wayFromFirst: wayTo(fromFirst, result),
		wayFromSecond: wayTo(fromSecond, result),
	};
	setCachedRoute(cacheKey, searchResult);
	return searchResult;
}
