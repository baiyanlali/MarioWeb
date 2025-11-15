import MarioSprite from "../core/MarioSprite.js";
import { SpriteType } from "../helper/SpriteType.js";
import MarioImage from "../graphics/MarioImage.js";
import Assets from "../helper/Assets.js";
import { EventType } from "../helper/EventType.js";

export default class FireFlower extends MarioSprite {
    graphics = new MarioImage(Assets.items, 1);
    life;

    constructor(visuals, x, y) {
        super(x, y, SpriteType.FIRE_FLOWER);
        this.width = 4;
        this.height = 12;
        this.facing = 1;
        this.life = 0;
        if (visuals) {
            this.graphics = new MarioImage(Assets.items, 1);
            this.graphics.originX = 8;
            this.graphics.originY = 15;
            this.graphics.width = 16;
            this.graphics.height = 16;
        }
    }

    clone() {
        let f = new FireFlower(false, this.x, this.y);
        f.xa = this.xa;
        f.ya = this.ya;
        f.initialCode = this.initialCode;
        f.width = this.width;
        f.height = this.height;
        f.facing = this.facing;
        f.life = this.life;
        return f;
    }

    collideCheck() {
        if (!this.alive) {
            return;
        }

        let xMarioD = this.world.mario.x - this.x;
        let yMarioD = this.world.mario.y - this.y;
        if (xMarioD > -16 && xMarioD < 16) {
            if (yMarioD > -this.height && yMarioD < this.world.mario.height) {
                this.world.addEvent(EventType.COLLECT, this.type[0]);
                this.world.mario.getFlower();
                this.world.removeSprite(this);
            }
        }
    }

    update() {
        if (!this.alive) {
            return;
        }

        super.update();
        this.life++;
        if (this.life < 9) {
            this.y--;
            return;
        }
        if (this.graphics != null) {
            this.graphics.index = 1 + Math.floor(this.life / 2) % 2;
        }
    }

    render(og) {
        super.render(og);
        this.graphics.render(og, Math.floor (this.x - this.world.cameraX), Math.floor (this.y - this.world.cameraY));
    }
}