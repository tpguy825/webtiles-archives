import { existsSync } from "fs";
import path from "path";

if (!process.argv[2] || !existsSync(process.argv[2])) throw new Error("must provide date directory");

const { port } = Bun.serve({
	port: 5050,
	async fetch(req) {
		const url = new URL(req.url),
			staticpath = path.join(
				import.meta.dir,
				process.argv[2]!,
				"webtiles.kicya.net",
				url.pathname,
				url.pathname.endsWith("/") ? "index.html" : "",
			);
		if (!staticpath.startsWith(import.meta.dir + "/2026-")) return new Response("", { status: 404 });
		if (existsSync(staticpath)) {
			const f = Bun.file(staticpath);
			console.log("file:", url.pathname);
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
