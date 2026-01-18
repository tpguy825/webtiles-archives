const { tiles } = await fetch("https://webtiles.kicya.net/api/tiles", {
	credentials: "include",
	headers: {
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0",
		Accept: "*/*",
		"Accept-Language": "en-GB,en;q=0.9",
		"Sec-GPC": "1",
		"Sec-Fetch-Dest": "empty",
		"Sec-Fetch-Mode": "cors",
		"Sec-Fetch-Site": "same-origin",
		Priority: "u=4",
		Pragma: "no-cache",
		"Cache-Control": "no-cache",
	},
	referrer: "https://webtiles.kicya.net/",
	method: "GET",
	mode: "cors",
}).then((r) => r.json() as Promise<{ tiles: Record<string, Record<string, { updated: number; domain: string }>> }>);

const tofetch: [number, number, { domain: string; updated: number }][] = [];

for (let i = -25; i <= 25; i++) {
	var si = String(i);
	for (let j = -25; j <= 25; j++) {
		var sj = String(j);
		if (si in tiles && sj in (tiles[si] ?? {}) && tiles[si]![sj] != undefined) {
			tofetch.push([i, j, tiles[si]![sj]!]);
		} else tofetch.push([i, j, { updated: 0, domain: "<empty>" }]);
	}
}
// const date = new Date(),
// 	[y, mo, d, h, m] = [
// 		date.getFullYear(),
// 		date.getMonth() + 1,
// 		date.getDate(),
// 		date.getHours(),
// 		date.getMinutes(),
// 	] as const;

await Bun.write(
	"t.urls.txt",
	[
		...new Set([
			"https://webtiles.kicya.net/",
			"https://webtiles.kicya.net/api/tiles",
			"https://webtiles.kicya.net/api/locks",
			"https://webtiles.kicya.net/s/dist/buildtime.txt",
			// cat images first because they could change while fetching and break the display
			// as far as im aware there aren't any other dynamic displays
			"https://webtiles.kicya.net/t/corner-tl.tpguy825.uk/index.html",
			"https://webtiles.kicya.net/t/corner-tl.tpguy825.uk/tl.jpg",
			"https://webtiles.kicya.net/t/corner-tr.tpguy825.uk/index.html",
			"https://webtiles.kicya.net/t/corner-tr.tpguy825.uk/tr.jpg",
			"https://webtiles.kicya.net/t/corner-bl.tpguy825.uk/index.html",
			"https://webtiles.kicya.net/t/corner-bl.tpguy825.uk/bl.jpg",
			"https://webtiles.kicya.net/t/corner-br.tpguy825.uk/index.html",
			"https://webtiles.kicya.net/t/corner-br.tpguy825.uk/br.jpg",
			...tofetch
				.filter((t) => t[2].domain !== "<empty>")
				.map((t) => `https://webtiles.kicya.net/t/${t[2].domain}/index.html`),
		]),
	].join("\n"),
);

// for (const [i, j, site] of tofetch) {
// 	if (site.domain == "<empty>") continue;
// 	await Bun.$`wget -mpEk --referer https://webtiles.kicya.net/ https://webtiles.kicya.net/t/${site.domain}/index.html -P ${dir}`.nothrow();
// 	// fetched.push({ site });
// }
// Bun.serve({
// 	port: 33333,
// 	async fetch() {
// 		return new Response(
// 			(await Bun.file("!.html").text()).replaceAll(
// 				"{{ body }}",
// 				tofetch
// 					.filter(t => t[2].updated > 0)
// 					.map(
// 						(t) =>
// 							`<a href="https://webtiles.kicya.net/t/${t[2].domain}/index.html">${t[2].domain} at ${t[0]}, ${t[1]}</a>`,
// 					)
// 					.join("\n"),
// 			),
// 			{
// 				headers: {
// 					"Content-Type": "text/html",
// 				},
// 			},
// 		);
// 	},
// });
