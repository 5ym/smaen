import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// HeartRails Express API (http のみ) をサーバー側で中継する
export const GET: RequestHandler = async ({ url }) => {
	const x = url.searchParams.get('x');
	const y = url.searchParams.get('y');
	if (!x || !y) {
		error(400, 'x (経度) と y (緯度) が必要です');
	}
	const apiUrl = `http://express.heartrails.com/api/json?method=getStations&x=${encodeURIComponent(x)}&y=${encodeURIComponent(y)}`;
	const res = await fetch(apiUrl);
	if (!res.ok) {
		error(502, '最寄り駅の取得に失敗しました');
	}
	return json(await res.json());
};
