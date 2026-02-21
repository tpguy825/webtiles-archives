#!/bin/bash
#echo Enter commit id: 
#read cid
cid=$1
git clone https://github.com/tpguy825/webtiles-archives webtiles-archives-$cid
cd webtiles-archives-$cid
git reset --hard $cid
bash serve.sh
