import Enemy from "./Enemy.js";
import {SpriteType} from "../helper/SpriteType.js";

export default class FlowerEnemy extends Enemy {
    yStart = 0;
    tick = 0; 
    waitTime = 0;

    constructor( visuals,  x,  y, dir, scene) {
        super(visuals, x, y, 0, scene, SpriteType.ENEMY_FLOWER);
        this.winged = false;
        this.noFireballDeath = false;
        this.width = 2;
        this.yStart = this.y;
        this.ya = -1;
        this.y -= 1;
        for (let i = 0; i < 4; i++) {
            this.update();
        }

        if (visuals) {
            this.graphics.originY = 24;
            this.tick = 0;
        }
    }

    clone() {
        let sprite = new FlowerEnemy(false, this.x, this.y);
        sprite.xa = this.xa;
        sprite.ya = this.ya;
        sprite.initialCode = this.initialCode;
        sprite.width = this.width;
        sprite.height = this.height;
        sprite.onGround = this.onGround;
        sprite.winged = this.winged;
        sprite.avoidCliffs = this.avoidCliffs;
        sprite.noFireballDeath = this.noFireballDeath;
        sprite.yStart = this.yStart;
        sprite.waitTime = this.waitTime;
        return sprite;
    }

    update() {
        if (!this.alive) {
            return;
        }

        if (this.ya > 0) {
            if (this.y >= this.yStart) {
                this.y = this.yStart;
                let xd = Math.floor(Math.abs(this.world.mario.x - this.x));
                this.waitTime++;
                if (this.waitTime > 40 && xd > 24) {
                    this.waitTime = 0;
                    this.ya = -1;
                }
            }
        } else if (this.ya < 0) {
            if (this.yStart - this.y > 20) {
                this.y = this.yStart - 20;
                this.waitTime++;
                if (this.waitTime > 40) {
                    this.waitTime = 0;
                    this.ya = 1;
                }
            }
        }
        this.y += this.ya;

        if (this.graphics != null) {
            this.tick++;
            this.graphics.index = this.type[1] + ((this.tick / 2) & 1) * 2 + ((this.tick / 6) & 1);
        }
    }
}