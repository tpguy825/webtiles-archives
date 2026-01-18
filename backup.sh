#!/bin/bash

bun index.ts
wget -mpEk -D webtiles.kicya.net --referer https://webtiles.kicya.net/ -i t.urls\ copy.txt -w 3