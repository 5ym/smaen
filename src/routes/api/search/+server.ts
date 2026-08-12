import { error, json } from '@sveltejs/kit';
import { searchMeetingPoint } from '$lib/server/transit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const first = url.searchParams.get('first')?.trim() ?? '';
	const second = url.searchParams.get('second')?.trim() ?? '';
	if (first === '' || second === '') {
		error(400, 'first と second の両方の駅名が必要です');
	}
	try {
		return json(await searchMeetingPoint(first, second));
	} catch (err) {
		error(502, err instanceof Error ? err.message : '経路検索に失敗しました');
	}
};
