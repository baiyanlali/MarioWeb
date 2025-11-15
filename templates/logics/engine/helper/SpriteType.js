import Enemy from "../sprites/Enemy.js";
import FlowerEnemy from "../sprites/FlowerEnemy.js";

export const SpriteType = {
    NONE: 0,
    UNDEF: -42,
    MARIO: -31,
    FIREBALL: 16,
    GOOMBA: [2, 16],
    GOOMBA_WINGED: [3, 16],
    RED_KOOPA: [4, 0],
    RED_KOOPA_WINGED: [5, 0],
    GREEN_KOOPA: [6, 8],
    GREEN_KOOPA_WINGED: [7, 8],
    SPIKY: [8, 24],
    SPIKY_WINGED: [9, 24],
    BULLET_BILL: [10, 40],
    ENEMY_FLOWER: [11, 48],
    MUSHROOM: 12,
    FIRE_FLOWER: 13,
    SHELL: 14,
    LIFE_MUSHROOM: 15
}


export function spawnSprite(sprite, visuals, xTile, yTile, dir, scene) {
    if (sprite === SpriteType.ENEMY_FLOWER) {
        return new FlowerEnemy(visuals, xTile * 16 + 17, yTile * 16 + 18, dir, scene);
    }
    return new Enemy(visuals, xTile * 16 + 8, yTile * 16 + 15, dir, scene, sprite);
}

