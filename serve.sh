#!/bin/bash

# path bugged???????
. ~/.bashrc
. stats.txt

echo "Archive taken: `date -f webtiles.kicya.net/_archivetime.txt -R`"
echo "Stats for this archive:"
echo "  Total claimed tiles: $claimedtiles/$totaltiles (`echo "$claimedtiles/$totaltiles*100" | bc -l | head -c 4`%)"
echo "  Tiles in this archive: $backeduptiles"
echo "  Tiles not in archive ('File not found' tiles): $notfoundtiles"
echo "  Unedited tiles ('This is an example tile.'): $exampletiles"
echo "  Wormed tiles: $wormedtiles"
echo ""

if [ ! -f ~/.bun/bin/bun ]; do
  echo "Bun not found in ~/.bun/bin/bun"
  echo "In order to view the archive in a web browser, you need to install Bun and run 'bash serve.sh' again."
  echo "Install Bun by running 'curl -fsSL https://bun.sh/install | bash -'"
done

wget -q -O- https://raw.githubusercontent.com/tpguy825/webtiles-archives/refs/heads/main/serve.ts | ~/.bun/bin/bun -
