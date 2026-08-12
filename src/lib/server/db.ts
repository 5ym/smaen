import { Database } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';
import { stationNames } from './stations';

mkdirSync('data', { recursive: true });

export const db = new Database('data/smaen.sqlite', { create: true });

db.exec(`
	PRAGMA journal_mode = WAL;

	CREATE TABLE IF NOT EXISTS stations (
		name TEXT PRIMARY KEY
	);

	CREATE TABLE IF NOT EXISTS route_cache (
		key TEXT PRIMARY KEY,
		json TEXT NOT NULL,
		created_at INTEGER NOT NULL
	);
`);

const stationCount = db
	.query<{ c: number }, []>('SELECT count(*) AS c FROM stations')
	.get();
if (stationCount && stationCount.c === 0) {
	const insert = db.prepare('INSERT OR IGNORE INTO stations (name) VALUES (?)');
	const seed = db.transaction((names: string[]) => {
		for (const name of names) {
			insert.run(name);
		}
	});
	seed(stationNames);
}

const CACHE_TTL_MS = 15 * 60 * 1000;

export function suggestStations(query: string, limit = 20): string[] {
	if (query === '') {
		return db
			.query<{ name: string }, []>('SELECT name FROM stations ORDER BY name')
			.all()
			.map((row) => row.name);
	}
	return db
		.query<{ name: string }, [string, number]>(
			"SELECT name FROM stations WHERE name LIKE ? || '%' ORDER BY name LIMIT ?",
		)
		.all(query, limit)
		.map((row) => row.name);
}

export function getCachedRoute<T>(key: string): T | null {
	const row = db
		.query<{ json: string; created_at: number }, [string]>(
			'SELECT json, created_at FROM route_cache WHERE key = ?',
		)
		.get(key);
	if (!row) return null;
	if (Date.now() - row.created_at > CACHE_TTL_MS) {
		db.query('DELETE FROM route_cache WHERE key = ?').run(key);
		return null;
	}
	return JSON.parse(row.json) as T;
}

export function setCachedRoute(key: string, value: unknown): void {
	db.query(
		'INSERT OR REPLACE INTO route_cache (key, json, created_at) VALUES (?, ?, ?)',
	).run(key, JSON.stringify(value), Date.now());
}
