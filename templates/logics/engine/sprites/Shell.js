import MarioSprite from "../core/MarioSprite.js";
import DeathEffect from "../effects/DeathEffect.js";
import MarioImage from "../graphics/MarioImage.js";
import Assets from "../helper/Assets.js";
import { EventType } from "../helper/EventType.js";
import { SpriteType } from "../helper/SpriteType.js";

export default class Shell extends MarioSprite {
     static GROUND_INERTIA = 0.89;
     static AIR_INERTIA = 0.89;

      shellType = 0;
      onGround = false;

      graphics = new MarioImage(Assets.enemies, 0 * 8 + 3);

     constructor( visuals,  x,  y,  shellType,  spriteCode) {
        super(x, y, SpriteType.SHELL);

        this.width = 4;
        this.height = 12;
        this.facing = 0;
        this.ya = -5;
        this.shellType = shellType;
        this.initialCode = spriteCode;

        if (visuals) {
            this.graphics = new MarioImage(Assets.enemies, shellType * 8 + 3);
            this.graphics.originX = 8;
            this.graphics.originY = 31;
            this.graphics.width = 16;
        }
    }

    clone() {
        let sprite = new Shell(false, this.x, this.y, this.shellType, this.initialCode);
        sprite.xa = this.xa;
        sprite.ya = this.ya;
        sprite.width = this.width;
        sprite.height = this.height;
        sprite.facing = this.facing;
        sprite.onGround = this.onGround;
        return sprite;
    }

    update() {
        if (!this.alive) return;

        super.update();

        let sideWaysSpeed = 11;

        if (this.xa > 2) {
            this.facing = 1;
        }
        if (this.xa < -2) {
            this.facing = -1;
        }

        this.xa = this.facing * sideWaysSpeed;

        if (this.facing != 0) {
            this.world.checkShellCollide(this);
        }

        if (!this.move(this.xa, 0)) {
            this.facing = -this.facing;
        }
        this.onGround = false;
        this.move(0, this.ya);

        this.ya *= 0.85;
        if (this.onGround) {
            this.xa *= Shell.GROUND_INERTIA;
        } else {
            this.xa *= Shell.AIR_INERTIA;
        }

        if (!this.onGround) {
            this.ya += 2;
        }

        if (this.graphics != null) {
            this.graphics.flipX = this.facing == -1;
        }
    }

    render(og) {
        super.render(og);
        this.graphics.render(og, Math.floor (this.x - this.world.cameraX), Math.floor (this.y - this.world.cameraY));
    }

     fireballCollideCheck(fireball) {
        if (!this.alive) return false;

        let xD = fireball.x - this.x;
        let yD = fireball.y - this.y;

        if (xD > -16 && xD < 16) {
            if (yD > -this.height && yD < fireball.height) {
                if (this.facing != 0)
                    return true;

                this.xa = fireball.facing * 2;
                this.ya = -5;
                if (this.graphics != null) {
                    this.world.addEffect(new DeathEffect(this.x, this.y, this.graphics.flipX, 41 + this.shellType, -5));
                }
                this.world.removeSprite(this);
                return true;
            }
        }
        return false;
    }

     collideCheck() {
        if (!this.alive) return;

        let xMarioD = this.world.mario.x - this.x;
        let yMarioD = this.world.mario.y - this.y;
        if (xMarioD > -16 && xMarioD < 16) {
            if (yMarioD > -this.height && yMarioD < this.world.mario.height) {
                if (this.world.mario.ya > 0 && yMarioD <= 0 && (!this.world.mario.onGround || !this.world.mario.wasOnGround)) {
                    this.world.mario.stomp(this);
                    if (this.facing != 0) {
                        this.xa = 0;
                        this.facing = 0;
                    } else {
                        this.facing = this.world.mario.facing;
                    }
                } else {
                    if (this.facing != 0) {
                        this.world.addEvent(EventType.HURT, this.type);
                        this.world.mario.getHurt();
                    } else {
                        this.world.addEvent(EventType.KICK, this.type);
                        this.world.mario.kick(this);
                        this.facing = this.world.mario.facing;
                    }
                }
            }
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

    isBlocking( _x,  _y,  xa,  ya) {
        let x = Math.floor (_x / 16);
        let y = Math.floor (_y / 16);
        if (x == Math.floor (this.x / 16) && y == Math.floor (this.y / 16))
            return false;

        let blocking = this.world.level.isBlocking(x, y, xa, ya);

        if (blocking && ya == 0 && xa != 0) {
            this.world.bump(x, y, true);
        }

        return blocking;
    }

      bumpCheck( xTile,  yTile) {
        if (!this.alive) return;

        if (this.x + this.width > xTile * 16 && this.x - this.width < xTile * 16 + 16 && yTile == Math.floor ((this.y - 1) / 16)) {
            this.facing = -this.world.mario.facing;
            this.ya = -10;
        }
    }

      shellCollideCheck( shell) {
        if (!this.alive) return false;

        let xD = shell.x - this.x;
        let yD = shell.y - this.y;

        if (xD > -16 && xD < 16) {
            if (yD > -this.height && yD < shell.height) {
                this.world.addEvent(EventType.SHELL_KILL, this.type);
                if (this != shell) {
                    this.world.removeSprite(shell);
                }
                this.world.removeSprite(this);
                return true;
            }
        }
        return false;
    }
}