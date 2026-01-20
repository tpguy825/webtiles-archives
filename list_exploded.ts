// tile diff since last archive

import { existsSync, readFileSync } from "fs";

const archived = JSON.parse(
	readFileSync(existsSync("./_tiles_old") ? "./_tiles_old" : "./webtiles.kicya.net/api/tiles", "utf8"),
) as RootObject;
const now = (await (
	await fetch("https://webtiles.kicya.net/api/tiles?t=" + Math.floor(Date.now() / 1000))
).json()) as RootObject;

const adomains = archived.success ? to_domains(archived.tiles) : [];
const ndomains = now.success ? to_domains(now.tiles) : [];

for (const d of adomains) {
	if (!ndomains.includes(d)) console.log("exploded: " + d);
}

function to_domains(tiles: TilesRecord) {
	const arr: string[] = [];
	for (let i = -25; i <= 25; i++) {
		const tilei = tiles[i];
		if (!tilei) continue;
		for (let j = -25; j <= 25; j++) {
			const tilej = tilei[j];
			if (!tilej) continue;
			if (tilej) arr.push(tilej.domain);
		}
	}
	return arr;
}

type RootObject =
	| {
			success: true;
			tiles: TilesRecord;
	  }
	| { success: false };

type TilesRecord = Record<string, undefined | Record<string, undefined | Tile>>;

interface Tile {
	domain: string;
	updated_at: number;
}

