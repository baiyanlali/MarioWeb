
class MarioLevelModel {
    //start and end of the level
    static MARIO_START = 'M';
    static MARIO_EXIT = 'F';
    static EMPTY = '-';

    //game tiles symbols
    static GROUND = 'X';
    static PYRAMID_BLOCK = '#';
    static NORMAL_BRICK = 'S';
    static COIN_BRICK = 'C';
    static LIFE_BRICK = 'L';
    static SPECIAL_BRICK = 'U';
    static SPECIAL_QUESTION_BLOCK = '@';
    static COIN_QUESTION_BLOCK = '!';
    static COIN_HIDDEN_BLOCK = '2';
    static LIFE_HIDDEN_BLOCK = '1';
    static USED_BLOCK = 'D';
    static COIN = 'o';
    static PIPE = 't';
    static PIPE_FLOWER = 'T';
    static BULLET_BILL = '*';
    static PLATFORM_BACKGROUND = '|';
    static PLATFORM = '%';

    //enemies that can be in the level
    static GOOMBA = 'g';
    static GOOMBA_WINGED = 'G';
    static RED_KOOPA = 'r';
    static RED_KOOPA_WINGED = 'R';
    static GREEN_KOOPA = 'k';
    static GREEN_KOOPA_WINGED = 'K';
    static SPIKY = 'y';
    static SPIKY_WINGED = 'Y';

    /**
     * Get array of level tiles that can spawn enemies
     *
     * @return tiles that spawn enemies
     */
    static getEnemyTiles() {
        return new [BULLET_BILL, PIPE_FLOWER];
    }

    /**
     * list of tiles that can be bumped by the player
     *
     * @return list of tiles that can be bumped by the player
     */
    static getBumpableTiles() {
        return [NORMAL_BRICK, COIN_BRICK, LIFE_BRICK, SPECIAL_BRICK,
            SPECIAL_QUESTION_BLOCK, COIN_QUESTION_BLOCK];
    }

    /**
     * list all the tiles that can block the player movement
     *
     * @return array of all tiles that block player movement
     */
    static getBlockTiles() {
        return new [GROUND, PYRAMID_BLOCK, USED_BLOCK,
            NORMAL_BRICK, COIN_BRICK, LIFE_BRICK, SPECIAL_BRICK,
            SPECIAL_QUESTION_BLOCK, COIN_QUESTION_BLOCK,
            PIPE, PIPE_FLOWER, BULLET_BILL];
    }

    /**
     * tiles that block the player and not interactive
     *
     * @return list of all solid tiles that don't interact
     */
    static getBlockNonSpecialTiles() {
        return new [GROUND, PYRAMID_BLOCK, USED_BLOCK, PIPE];
    }

    /**
     * list of all tiles that won't block the player movement
     *
     * @return list of all non blocking tiles
     */
    static getNonBlockingTiles() {
        return new [COIN, COIN_HIDDEN_BLOCK, LIFE_HIDDEN_BLOCK, PLATFORM_BACKGROUND];
    }

    /**
     * Get a list of all scene tiles that could produce something collected by the player
     *
     * @return list of all collectible scene tiles
     */
    static getCollectablesTiles() {
        return [COIN,
            COIN_BRICK, LIFE_BRICK, SPECIAL_BRICK,
            SPECIAL_QUESTION_BLOCK, COIN_QUESTION_BLOCK,
            COIN_HIDDEN_BLOCK, LIFE_HIDDEN_BLOCK];
    }

    /**
     * Get the correct version of the enemy char
     *
     * @param enemy  the enemy character
     * @param winged boolean to indicate if its a winged enemy
     * @return correct character based on winged
     */
    static getWingedEnemyVersion(enemy, winged) {
    if (!winged) {
    if (enemy == GOOMBA_WINGED) {
    return GOOMBA;
}
if (enemy == GREEN_KOOPA_WINGED) {
    return GREEN_KOOPA;
}
if (enemy == RED_KOOPA_WINGED) {
    return RED_KOOPA;
}
if (enemy == SPIKY_WINGED) {
    return SPIKY;
}
return enemy;
}
if (enemy == GOOMBA) {
    return GOOMBA_WINGED;
}
if (enemy == GREEN_KOOPA) {
    return GREEN_KOOPA_WINGED;
}
if (enemy == RED_KOOPA) {
    return RED_KOOPA_WINGED;
}
if (enemy == SPIKY) {
    return SPIKY_WINGED;
}
return enemy;
}

/**
 * a list of all enemy characters
 *
 * @return array of all enemy characters
 */
static getEnemyCharacters() {
    return [GOOMBA, GOOMBA_WINGED, RED_KOOPA, RED_KOOPA_WINGED,
        GREEN_KOOPA, GREEN_KOOPA_WINGED, SPIKY, SPIKY_WINGED];
}

/**
 * list of all enemy character based on wings
 *
 * @param wings true if the list contain winged enemies and false otherwise
 * @return an array of all wings enemy or not winged
 */
static getEnemyCharacters(wings) {
    if (wings) {
        return [GOOMBA_WINGED, RED_KOOPA_WINGED, GREEN_KOOPA_WINGED, SPIKY_WINGED];
    }
    return [GOOMBA, RED_KOOPA, GREEN_KOOPA, SPIKY];
}

/**
 * map object for helping
 */
map;

/**
 * create the Level Model
 *
 * @param levelWidth  the width of the level
 * @param levelHeight the height of the level
 */
MarioLevelModel( levelWidth,  levelHeight) {
    this.map = new char[levelWidth][levelHeight];
}

/**
 * create a similar clone to the current map
 */
 clone() {
    let model = new MarioLevelModel(this.getWidth(), this.getHeight());
    for (let x = 0; x < model.getWidth(); x++) {
        for (let y = 0; y < model.getHeight(); y++) {
            model.map[x][y] = this.map[x][y];
        }
    }
    return model;
}

/**
 * get map width
 *
 * @return map width
 */
 getWidth() {
    return this.map.length;
}

/**
 * get map height
 *
 * @return map height
 */
 getHeight() {
    return this.map[0].length;
}

/**
 * get the value of the tile in certain location
 *
 * @param x x tile position
 * @param y y tile position
 * @return the tile value
 */
getBlock( x,  y) {
    let currentX = x;
    let currentY = y;
    if (x < 0) currentX = 0;
    if (y < 0) currentY = 0;
    if (x > this.map.length - 1) currentX = this.map.length - 1;
    if (y > this.map[0].length - 1) currentY = this.map[0].length - 1;
    return this.map[currentX][currentY];
}

/**
 * set a tile on the map with certain value
 *
 * @param x     the x tile position
 * @param y     the y tile position
 * @param value the tile value to be set
 */
setBlock(x, y, value) {
    if (x < 0 || y < 0 || x > this.map.length - 1 || y > this.map[0].length - 1) return;
    this.map[x][y] = value;
}

/**
 * set a rectangle area of the map with a certain tile value
 *
 * @param startX the x tile position of the left upper corner
 * @param startY the y tile position of the left upper corner
 * @param width  the width of the rectangle
 * @param height the height of the rectangle
 * @param value  the tile value
 */
setRectangle(startX, startY, width, height, value) {
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            this.setBlock(startX + x, startY + y, value);
        }
    }
}

/**
 * Copy the string level to the current map
 *
 * @param level the input string level
 */
copyFromString(level) {
    this.copyFromString(0, 0, 0, 0, this.getWidth(), this.getHeight(), level);
}

/**
 * Copy portion from string to the current map
 *
 * @param targetX the x of the target location
 * @param targetY the y of the target location
 * @param sourceX the x from the level string
 * @param sourceY the y from the level string
 * @param width   the width of the copied portion
 * @param height  the height of the copied protion
 * @param level   the level string
 */
copyFromString(targetX, targetY, sourceX, sourceY, width, height, level) {
    let lines = level.split("\n");
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let maxWidth = lines[0].length();
            let maxHeight = lines.length;
            this.setBlock(x + targetX, y + targetY, lines[Math.min(y + sourceY, maxHeight - 1)].charAt(Math.min(x + sourceX, maxWidth - 1)));
        }
    }
}

/**
 * clear the whole map
 */
clearMap() {
    this.setRectangle(0, 0, this.getWidth(), this.getHeight(), EMPTY);
}

/**
 * get the string value of the map
 *
 * @return the map in form of string
 */
getMap() {
    let result = "";
    for (y = 0; y < map[0].length; y++) {
        for (x = 0; x < map.length; x++) {
            result += map[x][y];
        }
        result += "\n";
    }
    return result;
}

//    /**
//     * test the current level using a specific agent
//     *
//     * @param agent agent to test the level
//     * @param timer amount of time allowed to test that level
//     * @return statistical results about the level
//     */
//    MarioResult testALevelWithAgent(MarioAgent agent, timer) {
//        MarioGame game = new MarioGame();
//        return game.runGame(agent, this.getMap(), timer);
//    }
}
