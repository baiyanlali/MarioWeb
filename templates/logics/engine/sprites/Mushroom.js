import MarioImage from "../graphics/MarioImage.js";
import MarioSprite from "../core/MarioSprite.js";
import MarioEvent from "../core/MarioEvent.js";
import { EventType } from "../helper/EventType.js";
import { SpriteType } from "../helper/SpriteType.js";
import Assets from "../helper/Assets.js";
export default class Mushroom extends MarioSprite {
    onGround = false;
    life;
    graphics = new MarioImage(Assets.items, 0);

     static GROUND_INERTIA = 0.89;
     static AIR_INERTIA = 0.89;

    constructor(visuals,  x,  y) {
        super(x, y, SpriteType.MUSHROOM);
        this.width = 4;
        this.height = 12;
        this.facing = 1;
        this.life = 0;

        if (visuals) {
            this.graphics = new MarioImage(Assets.items, 0);
            this.graphics.width = 16;
            this.graphics.height = 16;
            this.graphics.originX = 8;
            this.graphics.originY = 15;
        }
    }

    clone() {
        let m = new Mushroom(false, this.x, this.y);
        m.xa = this.xa;
        m.ya = this.ya;
        m.initialCode = this.initialCode;
        m.width = this.width;
        m.height = this.height;
        m.facing = this.facing;
        m.life = this.life;
        m.onGround = this.onGround;
        return m;
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
                this.world.mario.getMushroom();
                this.world.removeSprite(this);
            }
        }
    }

    isBlocking( _x,  _y,  xa,  ya) {
        let x = Math.floor (_x / 16);
        let y = Math.floor (_y / 16);
        if (x == Math.floor (this.x / 16) && y == Math.floor (this.y / 16))
            return false;

        let blocking = this.world.level.isBlocking(x, y, xa, ya);
        return blocking;
    }

    bumpCheck( xTile,  yTile) {
        if (!this.alive) {
            return;
        }

        let x = this.x
        let y = this.y

        if (x + this.width > xTile * 16 && x - this.width < xTile * 16 + 16 && yTile == Math.floor ((y - 1) / 16)) {
            this.facing = -this.world.mario.facing;
            this.ya = -10;
        }
    }

    move( xa,  ya) {
        while (xa > 8) {
            if (!this.move(8, 0))
                return false;
            xa -= 8;
        }
        while (xa < -8) {
            if (!this.move(-8, 0))
                return false;
            xa += 8;
        }
        while (ya > 8) {
            if (!this.move(0, 8))
                return false;
            ya -= 8;
        }
        while (ya < -8) {
            if (!this.move(0, -8))
                return false;
            ya += 8;
        }

        let collide = false;
        if (ya > 0) {
            if (this.isBlocking(this.x + xa - this.width, this.y + ya, xa, 0))
                collide = true;
            else if (this.isBlocking(this.x + xa + this.width, this.y + ya, xa, 0))
                collide = true;
            else if (this.isBlocking(this.x + xa - this.width, this.y + ya + 1, xa, ya))
                collide = true;
            else if (this.isBlocking(this.x + xa + this.width, this.y + ya + 1, xa, ya))
                collide = true;
        }
        if (ya < 0) {
            if (this.isBlocking(this.x + xa, this.y + ya - this.height, xa, ya))
                collide = true;
            else if (collide || this.isBlocking(this.x + xa - this.width, this.y + ya - this.height, xa, ya))
                collide = true;
            else if (collide || this.isBlocking(this.x + xa + this.width, this.y + ya - this.height, xa, ya))
                collide = true;
        }
        if (xa > 0) {
            if (this.isBlocking(this.x + xa + this.width, this.y + ya - this.height, xa, ya))
                collide = true;
            if (this.isBlocking(this.x + xa + this.width, this.y + ya - this.height / 2, xa, ya))
                collide = true;
            if (this.isBlocking(this.x + xa + this.width, this.y + ya, xa, ya))
                collide = true;
        }
        if (xa < 0) {
            if (this.isBlocking(this.x + xa - this.width, this.y + ya - this.height, xa, ya))
                collide = true;
            if (this.isBlocking(this.x + xa - this.width, this.y + ya - this.height / 2, xa, ya))
                collide = true;
            if (this.isBlocking(this.x + xa - this.width, this.y + ya, xa, ya))
                collide = true;
        }

        if (collide) {
            if (xa < 0) {
                this.x = Math.floor ((this.x - this.width) / 16) * 16 + this.width;
                this.xa = 0;
            }
            if (xa > 0) {
                this.x = Math.floor ((this.x + this.width) / 16 + 1) * 16 - this.width - 1;
                this.xa = 0;
            }
            if (ya < 0) {
                this.y = Math.floor ((this.y - this.height) / 16) * 16 + this.height;
                this.ya = 0;
            }
            if (ya > 0) {
                this.y = Math.floor (this.y / 16 + 1) * 16 - 1;
                this.onGround = true;
            }
            return false;
        } else {
            this.x += xa;
            this.y += ya;
            return true;
        }
    }

    update() {
        if (!this.alive) {
            return;
        }

        if (this.life < 9) {
            this.y--;
            this.life++;
            return;
        }
        let sideWaysSpeed = 1.75;
        if (this.xa > 2) {
            this.facing = 1;
        }
        if (this.xa < -2) {
            this.facing = -1;
        }

        this.xa = this.facing * sideWaysSpeed;

        if (!this.move(this.xa, 0))
            this.facing = -this.facing;
        this.onGround = false;
        this.move(0, this.ya);

        this.ya *= 0.85;
        if (this.onGround) {
            this.xa *= Mushroom.GROUND_INERTIA;
        } else {
            this.xa *= Mushroom.AIR_INERTIA;
        }

        if (!this.onGround) {
            this.ya += 2;
        }
    }

    render(og) {
        super.render(og);
        this.graphics.render(og, Math.floor (this.x - this.world.cameraX), Math.floor (this.y - this.world.cameraY));
    }
}