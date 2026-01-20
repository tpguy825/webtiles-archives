#!/bin/bash

. ~/.bashrc


bash backup.sh
git add webtiles.kicya.net stats.txt
# unverified commit but idc
git commit -m "automated: twice daily archive"
git push -v
