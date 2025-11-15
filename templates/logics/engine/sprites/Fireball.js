import MarioSprite from "../core/MarioSprite.js";
import MarioImage from "../graphics/MarioImage.js";
import Assets from "../helper/Assets.js";
import { SpriteType } from "../helper/SpriteType.js";

export default class Fireball extends MarioSprite {

    static GROUND_INERTIA = 0.89;
    static AIR_INERTIA = 0.89;

     onGround = false;
     graphics = new MarioImage(Assets.particles, 24);
     anim = 0;

    constructor( visuals,  x,  y,  facing) {
        super(x, y, SpriteType.FIREBALL);
        this.facing = facing;
        this.ya = 4;
        this.width = 4;
        this.height = 8;

        if (visuals) {
            this.graphics = new MarioImage(Assets.particles, 24);
            this.graphics.originX = 8;
            this.graphics.originY = 8;
            this.graphics.width = 16;
            this.graphics.height = 16;
        }
    }

    clone() {
        let f = new Fireball(false, this.x, this.y, this.facing);
        f.xa = this.xa;
        f.ya = this.ya;
        f.initialCode = this.initialCode;
        f.width = this.width;
        f.height = this.height;
        f.onGround = this.onGround;
        return f;
    }

     move(xa, ya) {
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

     isBlocking( _x,  _y,  xa,  ya) {
        let x = Math.floor (_x / 16);
        let y = Math.floor (_y / 16);
        if (x == Math.floor (this.x / 16) && y == Math.floor (this.y / 16))
            return false;

        let blocking = this.world.level.isBlocking(x, y, xa, ya);

        return blocking;
    }

    update() {
        if (!this.alive) {
            return;
        }

        if (this.facing != 0)
            this.anim++;

        let sideWaysSpeed = 8;
        if (this.xa > 2) {
            this.facing = 1;
        }
        if (this.xa < -2) {
            this.facing = -1;
        }
        this.xa = this.facing * sideWaysSpeed;

        this.world.checkFireballCollide(this);

        if (!this.move(this.xa, 0)) {
            this.world.removeSprite(this);
            return;
        }

        this.onGround = false;
        this.move(0, this.ya);
        if (this.onGround)
            this.ya = -10;

        this.ya *= 0.95;
        if (this.onGround) {
            this.xa *= Fireball.GROUND_INERTIA;
        } else {
            this.xa *= Fireball.AIR_INERTIA;
        }

        if (!this.onGround) {
            this.ya += 1.5;
        }

        if (this.graphics != null) {
            this.graphics.flipX = this.facing === -1;
            this.graphics.index = 24 + this.anim % 4;
        }
    }

    render(og) {
        super.render(og);
        this.graphics.render(og, Math.floor (this.x - this.world.cameraX), Math.floor (this.y - this.world.cameraY));
    }
}
