# webtiles archive

Nightly (midnight utc) mirrors of [webtiles](https://webtiles.kicya.net).

## how to see archive

Open the [commit history](https://github.com/tpguy825/webtiles-archives/commits/main/) and pick the commit for the backup you want to view, then:

```bash
wget -O- https://raw.githubusercontent.com/tpguy825/webtiles-archives/refs/heads/main/fetch-specific.sh | bash -s - <commit id>
```

To view an already cloned archive:

```bash
bash serve.sh
```

## scripts

- backup.sh
	- refetches all tiles, generates stats and then commits to repo
- fetch-specific.sh
	- clones repo at a specific commit and then hosts it locally
- serve.sh
	- hosts archive locally