import MarioSprite from "../core/MarioSprite.js";
import {EventType} from "../helper/EventType.js";
import Assets from "../helper/Assets.js"; 
import MarioImage from "../graphics/MarioImage.js";
import DeathEffect from "../effects/DeathEffect.js";
export default class BulletBill extends MarioSprite {
    graphics = new MarioImage(Assets.enemies, 40);

    constructor( visuals,  x,  y,  dir, scene, type) {
        super(x, y, scene);
        this.width = 4;
        this.height = 12;
        this.ya = -5;
        this.facing = dir;
        this.type = type;


        if (visuals) {
            this.graphics = new MarioImage(Assets.enemies, 40);
            this.graphics.originX = 8;
            this.graphics.originY = 31;
            this.graphics.width = 16;
        }
    }

    clone() {
        let sprite = new BulletBill(false, this.x, this.y, this.facing, this.world, this.type);
        sprite.xa = this.xa;
        sprite.ya = this.ya;
        sprite.width = this.width;
        sprite.height = this.height;
        return sprite;
    }

    update() {
        if (!this.alive) {
            return;
        }

        super.update();
        let sideWaysSpeed = 4.0;
        this.xa = this.facing * sideWaysSpeed;
        this.move(this.xa, 0);
        if (this.graphics != null) {
            this.graphics.flipX = this.facing == -1;
        }
    }

    render(og) {
        super.render(og);
        this.graphics.render(og, Math.floor (this.x - this.world.cameraX), Math.floor (this.y - this.world.cameraY));
    }

    collideCheck() {
        if (!this.alive) {
            return;
        }

        let xMarioD = this.world.mario.x - this.x;
        let yMarioD = this.world.mario.y - this.y;
        if (xMarioD > -16 && xMarioD < 16) {
            if (yMarioD > -this.height && yMarioD < this.world.mario.height) {
                if (this.world.mario.ya > 0 && yMarioD <= 0 && (!this.world.mario.onGround || !this.world.mario.wasOnGround)) {
                    this.world.mario.stomp(this);
                    if (this.graphics != null) {
                        this.world.addEffect(new DeathEffect(this.x, this.y - 7, this.graphics.flipX, 43, 0));
                    }
                    this.world.removeSprite(this);
                } else {
                    this.world.addEvent(EventType.HURT, this.type[0]);
                    this.world.mario.getHurt();
                }
            }
        }
    }

    move( xa,  ya) {
        this.x += xa;
        return true;
    }

    fireballCollideCheck(fireball) {
        if (!this.alive) {
            return false;
        }

        let xD = fireball.x - this.x;
        let yD = fireball.y - this.y;

        if (xD > -16 && xD < 16) {
            return yD > -this.height && yD < fireball.height;
        }
        return false;
    }

    shellCollideCheck(shell) {
        if (!this.alive) {
            return false;
        }

        let xD = shell.x - this.x;
        let yD = shell.y - this.y;

        if (xD > -16 && xD < 16) {
            if (yD > -this.height && yD < shell.height) {
                if (this.graphics != null) {
                    this.world.addEffect(new DeathEffect(this.x, this.y - 7, this.graphics.flipX, 43, -1));
                }
                this.world.addEvent(EventType.SHELL_KILL, this.type[0]);
                this.world.removeSprite(this);
                return true;
            }
        }
        return false;
    }
}