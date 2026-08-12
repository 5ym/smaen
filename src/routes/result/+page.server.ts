import { error, redirect } from '@sveltejs/kit';
import { searchMeetingPoint } from '$lib/server/transit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const first = url.searchParams.get('first')?.trim() ?? '';
	const second = url.searchParams.get('second')?.trim() ?? '';
	if (first === '' || second === '') {
		redirect(302, '/');
	}
	try {
		return await searchMeetingPoint(first, second);
	} catch (err) {
		error(502, err instanceof Error ? err.message : '経路検索に失敗しました');
	}
};
