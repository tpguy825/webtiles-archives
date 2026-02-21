import { existsSync } from "fs";
import path from "path";

const { port } = Bun.serve({
	port: 22222,
	async fetch(req) {
		const url = new URL(req.url),
			staticpath = path.join(
				import.meta.dir,
				"webtiles.kicya.net",
				decodeURIComponent(url.pathname),
				url.pathname.endsWith("/") ? "index.html" : "",
			);
		// edited html to disable turnstile
		console.log(url.pathname);
		if (url.pathname == "/")
			return new Response(Bun.file("./webtiles.kicya.net/index.copy.html"), {
				headers: { "Content-Type": "text/html" },
			});
		if (url.pathname.startsWith("/s/dist/game.js"))
			return fetch("https://webtiles.kicya.net/s/dist/game.js?t=" + Math.floor(Date.now())).then(r => new Response(r.body, { headers: { "Content-Type": "application/javascript" }}));
		if (url.pathname.startsWith("/s/dist/buildtime.txt"))
			return fetch("https://webtiles.kicya.net/s/dist/buildtime.txt?t=" + Math.floor(Date.now())).then(
				(r) => new Response(r.body, { headers: { "Content-Type": "text/plain" } }),
			);
		if (!staticpath.startsWith(import.meta.dir + "/webtiles.kicya.net/")) return new Response("", { status: 404 });
		if (existsSync(staticpath)) {
			const f = Bun.file(staticpath);
			if (url.pathname.endsWith(".html") && url.pathname.startsWith("/t/")) {
				const text = await f.text();
				return new Response(replacement(text, path.dirname(url.pathname)), {
					headers: { "Content-Type": "text/html" },
				});
			} else
				return new Response(f, {
					headers: {
						"Content-Type": url.pathname.includes("@")
							? Bun.file(url.pathname.split("@")[0]!).type
							: f.type,
					},
				});
		}
		return new Response("", { status: 404 });
	},
});

console.log("listening on http://localhost:" + port);

function replacement(text: string, dir: string) {
	return (
		text
			// replace all relative links to full links
			.replaceAll('src="', `src="${dir}/`)
			.replaceAll("src='", `src='${dir}/`)
			.replaceAll('url("', `url("${dir}/`)
			.replaceAll("url('", `url('${dir}/`)
			.replaceAll('href="', `href="${dir}/`)
			.replaceAll("href='", `href='${dir}/`)

			// undo that for external links
			.replaceAll(`src="${dir}/http`, 'src="http')
			.replaceAll(`src='${dir}/http`, "src='http")
			.replaceAll(`url("${dir}/http`, 'url("http')
			.replaceAll(`url('${dir}/http`, "url('http")
			.replaceAll(`href="${dir}/http`, 'href="http')
			.replaceAll(`href='${dir}/http`, "href='http")
	);
}
