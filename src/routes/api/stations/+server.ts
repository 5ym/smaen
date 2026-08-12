import { json } from '@sveltejs/kit';
import { suggestStations } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	const query = url.searchParams.get('q')?.trim() ?? '';
	return json(suggestStations(query));
};
