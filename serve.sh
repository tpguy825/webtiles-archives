#!/bin/bash

. stats.txt

echo "Stats for this archive:"
echo "  Total claimed tiles: $claimedtiles/$totaltiles (`echo "$claimedtiles/$totaltiles*100" | bc -l | head -c 4`%)"
echo "  Tiles in this archive: $backeduptiles"
echo "  Tiles not in archive ('File not found' tiles): $notfoundtiles"
echo "  Unedited tiles ('This is an example tile.'): $exampletiles"
echo "  Wormed tiles: $wormedtiles"
echo ""

wget -q -O- https://raw.githubusercontent.com/tpguy825/webtiles-archives/refs/heads/main/serve.ts | bun -