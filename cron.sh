#!/bin/bash

bash backup.sh
git add webtiles.kicya.net stats.txt
# unverified commit but idc
git commit -m "automated: nightly archive"
git push