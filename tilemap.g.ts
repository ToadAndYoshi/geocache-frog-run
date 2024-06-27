// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile5 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile6 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile7 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile8 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile10 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile11 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile12 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level":
            case "level":return tiles.createTilemap(hex`11000d001212121212121212121212121212121212090000110000001100000000110000000a090000000010000000001000000010000a0900000f0000000f0000000f000000000a09000e0e0e00000e0e0e00000e0e0e000a090008000000080000000800000008000a090007000000070000000700000700000a090000060006000600060006000600000a090000000005000000050000000500000a090004040000040400000404000004000a090000000300000300000000030000000a090002000000020000000200000000000a0d010101010101010b010101010101010c`, img`
2 . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . 2 
2 . . . . . . . . . . . . . . . 2 
`, [myTiles.transparency16,sprites.dungeon.purpleOuterSouth0,myTiles.tile1,myTiles.tile2,myTiles.tile3,myTiles.tile4,myTiles.tile5,myTiles.tile6,myTiles.tile7,sprites.dungeon.purpleOuterWest1,sprites.dungeon.purpleOuterEast0,sprites.dungeon.purpleOuterSouth2,sprites.dungeon.purpleOuterSouthWest,sprites.dungeon.purpleOuterSouthEast,myTiles.tile8,myTiles.tile10,myTiles.tile11,myTiles.tile12,sprites.castle.tileGrass2], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "tile1":return tile1;
            case "tile2":return tile2;
            case "tile3":return tile3;
            case "tile4":return tile4;
            case "tile5":return tile5;
            case "tile6":return tile6;
            case "tile7":return tile7;
            case "tile8":return tile8;
            case "tile10":return tile10;
            case "tile11":return tile11;
            case "tile12":return tile12;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
