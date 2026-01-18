#!/bin/bash

wget -O- https://raw.githubusercontent.com/tpguy825/webtiles-archives/refs/heads/main/index.ts | bun -
wget -mpEk -D webtiles.kicya.net --referer https://webtiles.kicya.net/ -i t.urls.txt -w 3