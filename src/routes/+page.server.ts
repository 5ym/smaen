import { suggestStations } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return { stations: suggestStations('') };
};
