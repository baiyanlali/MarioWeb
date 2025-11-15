import MarioGame from "./MarioGame.js";
import {New2DArray} from "../../Util.js";
import {SpriteType} from "../helper/SpriteType.js";
import { TileFeature } from "../helper/TileFeature.js";
import Assets from "../helper/Assets.js";
import MarioTilemap from "../graphics/MarioTilemap.js";
import MarioImage from "../graphics/MarioImage.js";

export default class MarioLevel {

    width = MarioGame.width;
    tileWidth = Math.floor( MarioGame.width / 16);
    height = MarioGame.height;
    tileHeight = Math.floor(MarioGame.height / 16);
    totalCoins = 0;
    marioTileX = 0;
    marioTileY = 0;
    exitTileX = 0;
    exitTileY = 0;

    levelTiles;
    spriteTemplates;
    lastSpawnTime;
    solidMap;
    graphics;
    flag;

    constructor(level, visuals) {
        if (level.trim().length === 0) {
            this.tileWidth = 0;
            this.width = 0;
            this.tileHeight = 0;
            this.height = 0;
            return;
        }
        let lines = level.split("\n");
        // console.log(lines)
        this.tileWidth = lines[0].length;
        this.tileHeight = lines.length;
        this.width = this.tileWidth * 16;
        this.height = this.tileHeight * 16;


        this.levelTiles = New2DArray(lines[0].length, lines.length, 0)
        this.spriteTemplates = New2DArray(lines[0].length, lines.length, SpriteType.NONE)
        this.lastSpawnTime = New2DArray(lines[0].length, lines.length, -40)
        this.solidMap = New2DArray(lines[0].length, lines.length, false)

        this.visuals = visuals

        for (let y = 0; y < lines.length; y++) {
            for (let x = 0; x < lines[y].length; x++) {
                this.levelTiles[x][y] = 0;
                this.spriteTemplates[x][y] = SpriteType.NONE;
                this.lastSpawnTime[x][y] = -40;
            }
        }

        let marioLocInit = false;
        let exitLocInit = false;
        for (let y = 0; y < lines.length; y++) {
            for (let x = 0; x < lines[y].length; x++) {
                let c = lines[y].charAt(x);
                this.solidMap[x][y] = this.isSolid(c);
                switch (c) {
                    case 'M':
                        this.marioTileX = x;
                        this.marioTileY = y;
                        marioLocInit = true;
                        break;
                    case 'F':
                        this.exitTileX = x;
                        this.exitTileY = y;
                        exitLocInit = true;
                        break;
                    case 'y':
                        this.spriteTemplates[x][y] = SpriteType.SPIKY;
                        break;
                    case 'Y':
                        this.spriteTemplates[x][y] = SpriteType.SPIKY_WINGED;
                        break;
                    case 'E':
                    case 'g':
                        this.spriteTemplates[x][y] = SpriteType.GOOMBA;
                        break;
                    case 'G':
                        this.spriteTemplates[x][y] = SpriteType.GOOMBA_WINGED;
                        break;
                    case 'k':
                        this.spriteTemplates[x][y] = SpriteType.GREEN_KOOPA;
                        break;
                    case 'K':
                        this.spriteTemplates[x][y] = SpriteType.GREEN_KOOPA_WINGED;
                        break;
                    case 'r':
                        this.spriteTemplates[x][y] = SpriteType.RED_KOOPA;
                        break;
                    case 'R':
                        this.spriteTemplates[x][y] = SpriteType.RED_KOOPA_WINGED;
                        break;
                    case 'X':
                        //floor
                        this.levelTiles[x][y] = 1;
                        break;
                    case '#':
                        //pyramidBlock
                        this.levelTiles[x][y] = 2;
                        break;
                    case '%':
                        //jump through block
                    {
                        let tempIndex = 0;
                        if (x > 0 && lines[y].charAt(x - 1) === '%') {
                            tempIndex += 2;
                        }
                        if (x < this.levelTiles.length - 1 && lines[y].charAt(x + 1) === '%') {
                            tempIndex += 1;
                        }
                        this.levelTiles[x][y] = 43 + tempIndex;
                        break;
                    }
                    case '|':
                        //background for jump through block
                        this.levelTiles[x][y] = 47;
                        break;
                    case '*':
                        //bullet bill
                    {
                        let tempIndex = 0;
                        if (y > 0 && lines[y - 1].charAt(x) === '*') {
                            tempIndex += 1;
                        }
                        if (y > 1 && lines[y - 2].charAt(x) === '*') {
                            tempIndex += 1;
                        }
                        this.levelTiles[x][y] = 3 + tempIndex;
                        break;
                    }
                    case 'B':
                        //bullet bill head
                        this.levelTiles[x][y] = 3;
                        break;
                    case 'b': {
                        //bullet bill neck and body
                        let tempIndex = 0;
                        if (y > 1 && lines[y - 2].charAt(x) === 'B') {
                            tempIndex += 1;
                        }
                        this.levelTiles[x][y] = 4 + tempIndex;
                        break;
                    }
                    case '?':
                    case '@':
                        //mushroom question block
                        this.levelTiles[x][y] = 8;
                        break;
                    case 'Q':
                    case '!':
                        //coin question block
                        this.totalCoins += 1;
                        this.levelTiles[x][y] = 11;
                        break;
                    case '1':
                        //invisible 1 up block
                        this.levelTiles[x][y] = 48;
                        break;
                    case '2':
                        //invisible coin block
                        this.totalCoins += 1;
                        this.levelTiles[x][y] = 49;
                        break;
                    case 'D':
                        //used
                        this.levelTiles[x][y] = 14;
                        break;
                    case 'S':
                        //normal block
                        this.levelTiles[x][y] = 6;
                        break;
                    case 'C':
                        //coin block
                        this.totalCoins += 1;
                        this.levelTiles[x][y] = 7;
                        break;
                    case 'U':
                        //mushroom block
                        this.levelTiles[x][y] = 50;
                        break;
                    case 'L':
                        //1up block
                        this.levelTiles[x][y] = 51;
                        break;
                    case 'o':
                        //coin
                        this.totalCoins += 1;
                        this.levelTiles[x][y] = 15;
                        break;
                    case 't': {
                        //empty Pipe
                        let tempIndex = 0;
                        let singlePipe = false;
                        if (x < lines[y].length - 1 && lines[y].charAt(x + 1).toLowerCase() !== 't' &&
                            x > 0 && lines[y].charAt(x - 1).toLowerCase() !== 't') {
                            singlePipe = true;
                        }
                        if (x > 0 && (this.levelTiles[x - 1][y] === 18 || this.levelTiles[x - 1][y] === 20)) {
                            tempIndex += 1;
                        }
                        if (y > 0 && lines[y - 1].charAt(x).toLowerCase() === 't') {
                            if (singlePipe) {
                                tempIndex += 1;
                            } else {
                                tempIndex += 2;
                            }
                        }
                        if (singlePipe) {
                            this.levelTiles[x][y] = 52 + tempIndex;
                        } else {
                            this.levelTiles[x][y] = 18 + tempIndex;
                        }
                        break;
                    }
                    case 'T': {
                        //flower pipe
                        let tempIndex = 0;
                        let relateX = x;
                        const singlePipe = (relateX >= lines[y].length - 1 ||
                            lines[y].charAt(relateX + 1).toLowerCase() !== 't') &&
                            (relateX === 0 || lines[y].charAt(relateX - 1).toLowerCase() !== 't');
                        
                        let isRight = y > 0 && (this.levelTiles[x][y - 1] === 19 || this.levelTiles[x][y - 1] === 21);
                        isRight = isRight || (x > 0 && (this.levelTiles[x - 1][y] === 18 || this.levelTiles[x - 1][y] === 20));
                        
                        if (isRight) {
                            tempIndex += 1;
                        }
                        
                        if (y > 0 && lines[y - 1].charAt(relateX).toLowerCase() === 't' && x > 0 && this.levelTiles[x - 1][y] !== 18) {
                            if (singlePipe) {
                                tempIndex += 1;
                            } else {
                                tempIndex += 2;
                            }
                        }
                        
                        if (singlePipe) {
                            this.levelTiles[x][y] = 52 + tempIndex;
                        } else {
                            if (tempIndex === 0) {
                                this.spriteTemplates[x][y] = SpriteType.ENEMY_FLOWER;
                            }
                            this.levelTiles[x][y] = 18 + tempIndex;
                        }
                        break;
                    }
                    case '<':
                        //pipe top left
                        this.levelTiles[x][y] = 18;
                        break;
                    case '>':
                        //pipe top right
                        this.levelTiles[x][y] = 19;
                        break;
                    case '[':
                        //pipe body left
                        this.levelTiles[x][y] = 20;
                        break;
                    case ']':
                        //pipe body right
                        this.levelTiles[x][y] = 21;
                        break;
                }
            }
        }
        // TODO: Find first floor may crash
        if (!marioLocInit) {
            this.marioTileX = 0;
            this.marioTileY = this.findFirstFloor(lines, this.marioTileX);
        }
        if (!exitLocInit) {
            this.exitTileX = lines[0].length - 1;
            this.exitTileY = this.findFirstFloor(lines, this.exitTileX);
            // console.log("exit tile x", this.exitTileX)
        }
        for (let y = this.exitTileY; y > Math.max(1, this.exitTileY - 11); y--) {
            this.levelTiles[this.exitTileX][y] = 40;
        }
        this.levelTiles[this.exitTileX][Math.max(1, this.exitTileY - 11)] = 39;
    
        if (this.visuals) {
            this.graphics = new MarioTilemap(Assets.level, this.levelTiles);
            this.flag = new MarioImage(Assets.level, 41);
            this.flag.width = 16
            this.flag.height = 16
        }
    }

    clone() {
        let level = new MarioLevel("", false);
        level.width = this.width;
        level.height = this.height;
        level.tileWidth = this.tileWidth;
        level.tileHeight = this.tileHeight;
        level.totalCoins = this.totalCoins;
        level.marioTileX = this.marioTileX;
        level.marioTileY = this.marioTileY;
        level.exitTileX = this.exitTileX;
        level.exitTileY = this.exitTileY;
        //TODO: fix this
        level.levelTiles = New2DArray(this.levelTiles.length, this.levelTiles[0].length, 0);
        level.lastSpawnTime = New2DArray(this.levelTiles.length, this.levelTiles[0].length, 0);
        level.solidMap = New2DArray(this.levelTiles.length, this.levelTiles[0].length, false);
        for (let x = 0; x < level.levelTiles.length; x++) {
            for (let y = 0; y < level.levelTiles[x].length; y++) {
                level.levelTiles[x][y] = this.levelTiles[x][y];
                level.lastSpawnTime[x][y] = this.lastSpawnTime[x][y];
                level.solidMap[x][y] = this.solidMap[x][y];
            }
        }
        level.spriteTemplates = this.spriteTemplates;
        return level;
    }

    /**
     * 
     * @param {string} segmentStr 
     * @returns {void}
     */
    appendSegment(segmentStr) {
        if (segmentStr.trim().length === 0) {
            this.tileWidth = 0;
            this.width = 0;
            this.tileHeight = 0;
            this.height = 0;
            return;
        }
        const x0 = this.tileWidth;
        const lines = segmentStr.split(/\r?\n/);
        const segmentWidth = lines[0].length;
        this.tileWidth += segmentWidth;
        this.width += segmentWidth * 16;
        let exitLocInit = false;
        for (let x = x0; x < this.tileWidth; x++) {
            // Create new column arrays for each property
            this.levelTiles[x] = new Array(this.tileHeight).fill(0);
            this.spriteTemplates[x] = new Array(this.tileHeight).fill(SpriteType.NONE);
            this.lastSpawnTime[x] = new Array(this.tileHeight).fill(-40);
            this.solidMap[x] = new Array(this.tileHeight).fill(false);
            const relateX = x - x0;
            for (let y = 0; y < this.tileHeight; y++) {
                this.levelTiles[x][y] = 0;
                this.spriteTemplates[x][y] = SpriteType.NONE;
                this.lastSpawnTime[x][y] = -40;
                const c = lines[y].charAt(relateX);
                this.solidMap[x][y] = this.isSolid(c);
                switch (c) {
                    case 'F':
                        this.exitTileX = x;
                        this.exitTileY = y;
                        exitLocInit = true;
                        break;
                    case 'y':
                        this.spriteTemplates[x][y] = SpriteType.SPIKY;
                        this.totalEnemies = (this.totalEnemies || 0) + 1;
                        break;
                    case 'Y':
                        this.spriteTemplates[x][y] = SpriteType.SPIKY_WINGED;
                        this.totalEnemies = (this.totalEnemies || 0) + 1;
                        break;
                    case 'E':
                    case 'g':
                        this.spriteTemplates[x][y] = SpriteType.GOOMBA;
                        this.totalEnemies = (this.totalEnemies || 0) + 1;
                        break;
                    case 'G':
                        this.spriteTemplates[x][y] = SpriteType.GOOMBA_WINGED;
                        this.totalEnemies = (this.totalEnemies || 0) + 1;
                        break;
                    case 'k':
                        this.spriteTemplates[x][y] = SpriteType.GREEN_KOOPA;
                        this.totalEnemies = (this.totalEnemies || 0) + 1;
                        break;
                    case 'K':
                        this.spriteTemplates[x][y] = SpriteType.GREEN_KOOPA_WINGED;
                        this.totalEnemies = (this.totalEnemies || 0) + 1;
                        break;
                    case 'r':
                        this.spriteTemplates[x][y] = SpriteType.RED_KOOPA;
                        this.totalEnemies = (this.totalEnemies || 0) + 1;
                        break;
                    case 'R':
                        this.spriteTemplates[x][y] = SpriteType.RED_KOOPA_WINGED;
                        this.totalEnemies = (this.totalEnemies || 0) + 1;
                        break;
                    case 'X':
                        this.levelTiles[x][y] = 1;
                        break;
                    case '#':
                        this.levelTiles[x][y] = 2;
                        break;
                    case '%': {
                        let tempIndex = 0;
                        if (relateX > 0 && lines[y].charAt(relateX - 1) === '%') {
                            tempIndex += 2;
                        }
                        if (relateX < lines[y].length - 1 && lines[y].charAt(relateX + 1) === '%') {
                            tempIndex += 1;
                        }
                        this.levelTiles[x][y] = 43 + tempIndex;
                        break;
                    }
                    case '|':
                        this.levelTiles[x][y] = 47;
                        break;
                    case '*': {
                        let tempIndex = 0;
                        if (y > 0 && lines[y - 1].charAt(relateX) === '*') {
                            tempIndex += 1;
                        }
                        if (y > 1 && lines[y - 2].charAt(relateX) === '*') {
                            tempIndex += 1;
                        }
                        this.levelTiles[x][y] = 3 + tempIndex;
                        break;
                    }
                    case 'B':
                        this.levelTiles[x][y] = 3;
                        break;
                    case 'b': {
                        let tempIndex = 0;
                        if (y > 1 && lines[y - 2].charAt(relateX) === 'B') {
                            tempIndex += 1;
                        }
                        this.levelTiles[x][y] = 4 + tempIndex;
                        break;
                    }
                    case '?':
                    case '@':
                        this.levelTiles[x][y] = 8;
                        this.totalItems = (this.totalItems || 0) + 1;
                        break;
                    case 'Q':
                    case '!':
                        this.totalCoins += 1;
                        this.levelTiles[x][y] = 11;
                        this.totalItems = (this.totalItems || 0) + 1;
                        break;
                    case '1':
                        this.levelTiles[x][y] = 48;
                        this.totalItems = (this.totalItems || 0) + 1;
                        break;
                    case '2':
                        this.totalCoins += 1;
                        this.levelTiles[x][y] = 49;
                        this.totalItems = (this.totalItems || 0) + 1;
                        break;
                    case 'D':
                        this.levelTiles[x][y] = 14;
                        break;
                    case 'S':
                        this.levelTiles[x][y] = 6;
                        break;
                    case 'C':
                        this.totalCoins += 1;
                        this.levelTiles[x][y] = 7;
                        break;
                    case 'U':
                        this.levelTiles[x][y] = 50;
                        this.totalItems = (this.totalItems || 0) + 1;
                        break;
                    case 'L':
                        this.levelTiles[x][y] = 51;
                        this.totalItems = (this.totalItems || 0) + 1;
                        break;
                    case 'o':
                        this.totalCoins += 1;
                        this.levelTiles[x][y] = 15;
                        break;
                    case 't': {
                        let tempIndex = 0;
                        const singlePipe =
                            relateX < lines[y].length - 1 &&
                            lines[y].charAt(relateX + 1).toLowerCase() !== 't' &&
                            relateX > 0 &&
                            lines[y].charAt(relateX - 1).toLowerCase() !== 't';
                        if (x > 0 && (this.levelTiles[x - 1][y] === 18 || this.levelTiles[x - 1][y] === 20)) {
                            tempIndex += 1;
                        }
                        if (y > 0 && lines[y - 1].charAt(relateX).toLowerCase() === 't') {
                            tempIndex += singlePipe ? 1 : 2;
                        }
                        this.levelTiles[x][y] = singlePipe ? 52 + tempIndex : 18 + tempIndex;
                        break;
                    }
                    case 'T': {
                        //flower pipe
                        let tempIndex = 0;
                        const singlePipe = (relateX >= lines[y].length - 1 ||
                            lines[y].charAt(relateX + 1).toLowerCase() !== 't') &&
                            (relateX === 0 || lines[y].charAt(relateX - 1).toLowerCase() !== 't');
                        
                        let isRight = y > 0 && (this.levelTiles[x][y - 1] === 19 || this.levelTiles[x][y - 1] === 21);
                        isRight = isRight || (x > 0 && (this.levelTiles[x - 1][y] === 18 || this.levelTiles[x - 1][y] === 20));
                        
                        if (isRight) {
                            tempIndex += 1;
                        }
                        
                        if (y > 0 && lines[y - 1].charAt(relateX).toLowerCase() === 't' && x > 0 && this.levelTiles[x - 1][y] !== 18) {
                            if (singlePipe) {
                                tempIndex += 1;
                            } else {
                                tempIndex += 2;
                            }
                        }
                        
                        if (singlePipe) {
                            this.levelTiles[x][y] = 52 + tempIndex;
                        } else {
                            if (tempIndex === 0) {
                                this.spriteTemplates[x][y] = SpriteType.ENEMY_FLOWER;
                            }
                            this.levelTiles[x][y] = 18 + tempIndex;
                        }
                        break;
                    }
                    case '<':
                        this.levelTiles[x][y] = 18;
                        break;
                    case '>':
                        this.levelTiles[x][y] = 19;
                        break;
                    case '[':
                        this.levelTiles[x][y] = 20;
                        break;
                    case ']':
                        this.levelTiles[x][y] = 21;
                        break;
                }
            }
        }
        if (!exitLocInit) {
            this.exitTileX = this.tileWidth - 1;
            this.exitTileY = this.findFirstFloor(lines, this.exitTileX - x0);
        }
        for (let y = this.exitTileY; y > Math.max(1, this.exitTileY - 11); y--) {
            this.levelTiles[this.exitTileX][y] = 40;
        }
        this.levelTiles[this.exitTileX][Math.max(1, this.exitTileY - 11)] = 39;
        this.graphics.updateLevel(this.levelTiles);
    }

    isBlocking(xTile, yTile, xa, ya) {
        //xTile 指横着的，代表的是Y， yTile相反
        let block = this.getBlock(xTile, yTile);
        let features = TileFeature.getTileType(block);
        let blocking = features.includes(TileFeature.BLOCK_ALL);
        blocking ||= (ya < 0) && features.includes(TileFeature.BLOCK_UPPER);
        blocking ||= (ya > 0) && features.includes(TileFeature.BLOCK_LOWER);

        return blocking;
    }

    getBlock(xTile, yTile) {
        if (xTile < 0) {
            xTile = 0;
        }
        if (xTile > this.tileWidth - 1) {
            xTile = this.tileWidth - 1;
        }
        if (yTile < 0 || yTile > this.tileHeight - 1) {
            return 0;
        }
        return this.levelTiles[xTile][yTile];
    }

    setBlock(xTile, yTile, index) {
        if (xTile < 0 || yTile < 0 || xTile > this.tileWidth - 1 || yTile > this.tileHeight - 1) {
            return;
        }
        this.levelTiles[xTile][yTile] = index;
    }

    setShiftIndex(xTile, yTile, shift) {
        if (this.graphics == null || xTile < 0 || yTile < 0 || xTile > this.tileWidth - 1 || yTile > this.tileHeight - 1) {
            return;
        }
        this.graphics.moveShift[xTile][yTile] = shift;
    }

    getSpriteType(xTile, yTile) {
        if (xTile < 0 || yTile < 0 || xTile >= this.tileWidth || yTile >= this.tileHeight) {
            return SpriteType.NONE;
        }
        return this.spriteTemplates[xTile][yTile];
    }

    getLastSpawnTick(xTile, yTile) {
        if (xTile < 0 || yTile < 0 || xTile > this.tileWidth - 1 || yTile > this.tileHeight - 1) {
            return 0;
        }
        return this.lastSpawnTime[xTile][yTile];
    }

    setLastSpawnTick(xTile, yTile, tick) {
        if (xTile < 0 || yTile < 0 || xTile > this.tileWidth - 1 || yTile > this.tileHeight - 1) {
            return;
        }
        this.lastSpawnTime[xTile][yTile] = tick;
    }

    getSpriteCode(xTile, yTile) {
        return xTile + "_" + yTile + "_" + this.getSpriteType(xTile, yTile)[0]??this.getSpriteType(xTile, yTile);
    }

    isSolid(c) {
        return c === 'X' || c === '#' || c === '@' || c === '!' || c === 'B' || c === 'C' ||
            c === 'Q' || c === '<' || c === '>' || c === '[' || c === ']' || c === '?' ||
            c === 'S' || c === 'U' || c === 'D' || c === '%' || c === 't' || c === 'T';
    }

    findFirstFloor(lines, x) {
        let skipLines = true;
        for (let i = lines.length - 1; i >= 0; i--) {
            let c = lines[i].charAt(x);
            if (this.isSolid(c)) {
                skipLines = false;
                continue;
            }
            if (!skipLines && !this.isSolid(c)) {
                return i;
            }
        }
        return -1;
    }

    update(cameraX, cameraY) {}

    render(og, cameraX, cameraY) {
        this.graphics.render(og, cameraX, cameraY);
        if (cameraX + MarioGame.width >= this.exitTileX * 16) {
            this.flag.render(og, this.exitTileX * 16 - 8 - cameraX, Math.max(1, this.exitTileY - 11) * 16 + 16 - cameraY);
        }
    }

    standable(xTile, yTile) {

        if (yTile >= this.tileHeight)
            return false;
        // console.log(this.solidMap)
        // return true
        return !this.solidMap[xTile][yTile] && this.solidMap[xTile][yTile + 1];
    }
}
