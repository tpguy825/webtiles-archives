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

import { readFileSync, readdirSync, rmdirSync } from "fs";
import path from "path";

const tiles = JSON.parse(
        readFileSync("./webtiles.kicya.net/api/tiles", "utf8"),
) as RootObject;

const domains = tiles.success ? to_domains(tiles.tiles) : [], todelete = [];

for (const d of readdirSync("./webtiles.kicya.net/t/")) {
	if (!domains.includes(d)) {
		console.log("deleted:", d);
		todelete.push(d);
	}
}

if (process.argv[2] != "--rm") console.log("use --rm to delete these");
else todelete.forEach(t => rmdirSync(path.join("./webtiles.kicya.net/t/", t)), { recursive: true });
