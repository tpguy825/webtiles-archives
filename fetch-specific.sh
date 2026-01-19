#!/bin/bash
echo Enter commit id: 
read cid
git clone --revision=$cid --depth=1 https://github.com/tpguy825/webtiles-archives webtiles-archives-$cid
cd webtiles-archives-$cid
bash serve.sh
