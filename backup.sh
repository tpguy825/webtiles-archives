#!/bin/bash

# fetch latest one regardless of current repo state
if [ -f "stats.txt" ]; then
    rm stats.txt
fi

. ~/.bashrc

if [ -f "webtiles.kicya.net/api/tiles" ]; then
	cp webtiles.kicya.net/api/tiles ./_tiles_old
fi

wget -q -O- https://raw.githubusercontent.com/tpguy825/webtiles-archives/refs/heads/main/index.ts | ~/.bun/bin/bun -

. stats.txt

echo "Archiving $claimedtiles tiles..."

# will take ~3 hours with ratelimiting

# -e robots=off because cloudflare ai protection breaks fedora wget
echo started wget at `date --date='TZ="UTC" now' -Iseconds`
# wget -mpEk -D webtiles.kicya.net --referer https://webtiles.kicya.net/ -i t.urls.txt -w 3 --user-agent "WebTiles-Archiver/1.0 Wget/2.2.1 (+https://github.com/tpguy825/webtiles-archives)" -e robots=off
wget -o wget.log -mpEkc --compression=zstd,br,gzip,deflate -D webtiles.kicya.net --referer https://webtiles.kicya.net/ -i t.urls.txt -w 3 --user-agent "WebTiles-Archiver/1.0 Wget/2.2.1 (+https://github.com/tpguy825/webtiles-archives)" -e robots=off
echo finished wget at `date --date='TZ="UTC" now' -Iseconds`
date --date='TZ="UTC" now' -Iseconds > webtiles.kicya.net/_archivetime.txt

echo "Generating stats..."

# will take a moment
echo "exampletiles=`grep "This is an example tile." -r webtiles.kicya.net/t/ | wc -l`" >> stats.txt
echo "wormedtiles=`grep "webtiles-data" -r webtiles.kicya.net/t/ | wc -l`" >> stats.txt
backeduptiles="`ls webtiles.kicya.net/t/ | wc -l`"
notfoundtiles=$(echo "$claimedtiles-$backeduptiles" | bc)
echo "backeduptiles=$backeduptiles" >> stats.txt
echo "notfoundtiles=$notfoundtiles" >> stats.txt

if [ -f "./_tiles_old" ]; then
	echo "Exploded (removed) since last archive:"
	wget -q -O- https://raw.githubusercontent.com/tpguy825/webtiles-archives/refs/heads/main/list_exploded.ts | ~/.bun/bin/bun -
	rm ./_tiles_old
fi
