type RootObject =
        | {
                        success: true;
                        tiles: TilesRecord;
          }
        | { success: false };

type TilesRecord = Record<string, undefined | Record<string, undefined | Tile>>;

interface Tile {
        domain: string;
        updated_at: number;
}
