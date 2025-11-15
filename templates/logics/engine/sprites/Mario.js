import MarioSprite from "../core/MarioSprite.js";
import { MarioActions } from "../helper/MarioActions.js";
import { EventType } from "../helper/EventType.js";
import { TileFeature } from "../helper/TileFeature.js"
import MarioGame from "../core/MarioGame.js";
import { SpriteType } from "../helper/SpriteType.js";
import MarioImage from "../graphics/MarioImage.js";
import Assets from "../helper/Assets.js";
import MarioWorld from "../core/MarioWorld.js";
import Fireball from "./Fireball.js";
export default class Mario extends MarioSprite {


    isLarge;
    isFire;
    onGround;
    wasOnGround;
    isDucking;
    canShoot;
    mayJump;
    actions = [];
    jumpTime = 0;

    xJumpSpeed;
    yJumpSpeed = 0;
    invulnerableTime = 0;

    marioFrameSpeed = 0;
    oldLarge;
    oldFire = false;
    graphics = new MarioImage(Assets.smallMario, 0);

    // stats
    xJumpStart = -100;

    GROUND_INERTIA = 0.89;
    AIR_INERTIA = 0.89;
    POWERUP_TIME = 3;

    scene;

    /** @type {MarioWorld} */
    world;
    type;

    x;
    y;

    constructor(visuals, x, y, scene, type) {
        super(x + 8, y + 15, scene)
        this.isLarge = this.oldLarge = false;
        this.isFire = this.oldFire = false;
        this.width = 4;
        this.height = 24;
        this.type = SpriteType.MARIO;
        this.x = x + 8;
        this.y = y + 15;
        this.onGround = true;

        if (visuals) {
            this.graphics = new MarioImage(Assets.smallMario, 0)
        }

    }

    move(xa, ya) {
        // console.log("move")
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
                this.x = Math.floor((this.x - this.width) / 16) * 16 + this.width;
                this.xa = 0;
            }
            if (xa > 0) {
                this.x = Math.floor((this.x + this.width) / 16 + 1) * 16 - this.width - 1;
                this.xa = 0;
            }
            if (ya < 0) {
                this.y = Math.floor((this.y - this.height) / 16) * 16 + this.height;
                this.jumpTime = 0;
                this.ya = 0;
            }
            if (ya > 0) {
                this.y = Math.floor((this.y - 1) / 16 + 1) * 16 - 1;
                this.onGround = true;
                // console.log("on ground = true")
            }
            return false;
        } else {
            this.x += xa;
            this.y += ya;
            return true;
        }
    }

    updateGraphics() {


        if (!this.alive)
            return


        let currentLarge;
        let currentFire;
        if (this.world.pauseTimer > 0) {
            currentLarge = Math.floor(this.world.pauseTimer / 2) % 2 == 0 ? this.oldLarge : this.isLarge;
            currentFire = Math.floor(this.world.pauseTimer / 2) % 2 == 0 ? this.oldFire : this.isFire;
        } else {
            currentLarge = this.isLarge;
            currentFire = this.isFire;
        }

        if (currentLarge) {
            this.graphics.sheet = Assets.mario;
            if (currentFire) {
                this.graphics.sheet = Assets.fireMario;
            }

            this.graphics.originX = 16;
            this.graphics.originY = 31;
            this.graphics.width = this.graphics.height = 32;
        } else {
            this.graphics.sheet = Assets.smallMario;
            this.graphics.originX = 8;
            this.graphics.originY = 15;
            this.graphics.width = this.graphics.height = 16;
        }

        let xa = this.xa

        this.marioFrameSpeed += Math.abs(xa) + 5;

        if (Math.abs(xa) < 0.5) {
            this.marioFrameSpeed = 0;
        }


        this.graphics.visible = ((this.invulnerableTime / 2) & 1) == 0;
        this.graphics.flipX = this.facing === -1;


        let frameIndex = 0;
        if (currentLarge) {
            frameIndex = (Math.floor(this.marioFrameSpeed / 20)) % 4;
            if (frameIndex == 3)
                frameIndex = 1;
            if (Math.abs(xa) > 10)
                frameIndex += 3;
            if (!this.onGround) {
                if (Math.abs(xa) > 10)
                    frameIndex = 6;
                else
                    frameIndex = 5;
            }
        } else {
            frameIndex = (Math.floor(this.marioFrameSpeed / 20)) % 2;
            if (Math.abs(xa) > 10)
                frameIndex += 2;
            if (!this.onGround) {
                if (Math.abs(xa) > 10)
                    frameIndex = 5;
                else
                    frameIndex = 4;
            }
        }

        if (this.onGround && ((this.facing == -1 && xa > 0) || (this.facing == 1 && xa < 0))) {
            if (xa > 1 || xa < -1)
                frameIndex = currentLarge ? 8 : 7;
        }

        if (currentLarge && this.isDucking) {
            frameIndex = 13;
        }

        this.graphics.index = frameIndex;

    }

    update() {
        // console.log("update")
        // this.setPosition(0, 0)
        // return
        if (!this.alive) {
            return;
        }

        // if (this.world.currentTick == 564 || this.world.currentTick == 565 || this.world.currentTick == 563) {
        //     console.log(`mario update ${this.world.currentTick}: x: ${this.x} y: ${this.y} xa: ${this.xa} ya: ${this.ya} onGround: ${this.onGround} jumpTime: ${this.jumpTime} isDucking: ${this.isDucking} invuln: ${this.invulnerableTime}`)
        // }
        if (this.invulnerableTime > 0) {
            this.invulnerableTime--;
        }
        this.wasOnGround = this.onGround;

        let sideWaysSpeed = this.actions[MarioActions.SPEED[0]] ? 1.2 : 0.6;


        if (this.onGround) {
            this.isDucking = this.actions[MarioActions.DOWN[0]] && this.isLarge;
        }

        if (this.isLarge) {
            this.height = this.isDucking ? 12 : 24;
        } else {
            this.height = 12;
        }

        if (this.xa > 2) {
            this.facing = 1;
        }
        if (this.xa < -2) {
            this.facing = -1;
        }

        if (this.actions[MarioActions.JUMP[0]] || (this.jumpTime < 0 && !this.onGround)) {
            // console.log("jump")
            if (this.jumpTime < 0) {
                this.xa = this.xJumpSpeed;
                this.ya = -this.jumpTime * this.yJumpSpeed;
                this.jumpTime++;
            } else if (this.onGround && this.mayJump) {
                this.xJumpSpeed = 0;
                this.yJumpSpeed = -1.9;
                this.jumpTime = 7;
                this.ya = this.jumpTime * this.yJumpSpeed;
                this.onGround = false;
                if (!(this.isBlocking(this.x, this.y - 4 - this.height, 0, -4) || this.isBlocking(this.x - this.width, this.y - 4 - this.height, 0, -4)
                    || this.isBlocking(this.x + this.width, this.y - 4 - this.height, 0, -4))) {
                    this.xJumpStart = this.x;
                    this.world.addEvent(EventType.JUMP, 0);
                }
            } else if (this.jumpTime > 0) {
                this.xa += this.xJumpSpeed;
                this.ya = this.jumpTime * this.yJumpSpeed;
                this.jumpTime--;
            }
        } else {
            this.jumpTime = 0;
        }

        if (this.actions[MarioActions.LEFT[0]] && !this.isDucking) {
            this.xa -= sideWaysSpeed;
            if (this.jumpTime >= 0)
                this.facing = -1;
        }



        if (this.actions[MarioActions.RIGHT[0]] && !this.isDucking) {
            this.xa += sideWaysSpeed;
            if (this.jumpTime >= 0)
                this.facing = 1;
        }

        if (this.actions[MarioActions.SPEED[0]] && this.canShoot && this.isFire && this.world.fireballsOnScreen < 2) {
            this.world.addSprite(new Fireball(this.graphics != null, this.x + this.facing * 6, this.y - 20, this.facing));
        }

        this.canShoot = !this.actions[MarioActions.SPEED[0]];

        this.mayJump = this.onGround && !this.actions[MarioActions.JUMP[0]];
        // console.log(`May Jump ${this.mayJump} ${this.onGround} ${this.actions[MarioActions.JUMP[0]]}`)

        if (Math.abs(this.xa) < 0.5) {
            this.xa = 0;
        }

        this.onGround = false;
        this.move(this.xa, 0);
        this.move(0, this.ya);
        if (!this.wasOnGround && this.onGround && this.xJumpStart >= 0) {
            this.world.addEvent(EventType.LAND, 0);
            this.xJumpStart = -100;
        }

        if (this.x < 0) {
            this.x = 0;
            this.xa = 0;
        }

        if (this.x > this.world.level.exitTileX * 16) {
            this.x = this.world.level.exitTileX * 16;
            this.xa = 0;
            this.world.win();
        }

        this.ya *= 0.85;
        if (this.onGround) {
            this.xa *= this.GROUND_INERTIA;
        } else {
            this.xa *= this.AIR_INERTIA;
        }

        if (!this.onGround) {
            this.ya += 3;
        }

        this.scaleX = this.facing;

        // if (this.world.currentTick == 564 || this.world.currentTick == 565 || this.world.currentTick == 563) {
        //     console.log(`mario updated ${this.world.currentTick}: x: ${this.x} y: ${this.y} xa: ${this.xa} ya: ${this.ya} onGround: ${this.onGround} jumpTime: ${this.jumpTime} isDucking: ${this.isDucking} invuln: ${this.invulnerableTime}`)
        // }

        if (this.graphics != null) {
            this.updateGraphics();
        }

    }

    isBlocking(_x, _y, xa, ya) {
        let xTile = Math.floor(_x / 16);
        let yTile = Math.floor(_y / 16);
        if (xTile === Math.floor(this.x / 16) && yTile === Math.floor(this.y / 16))
            return false;

        let blocking = this.world.level.isBlocking(xTile, yTile, xa, ya);
        let block = this.world.level.getBlock(xTile, yTile);

        if (TileFeature.getTileType(block).includes(TileFeature.PICKABLE)) {
            this.world.addEvent(EventType.COLLECT, block);
            this.collectCoin();
            this.world.level.setBlock(xTile, yTile, 0);
        }
        if (blocking && ya < 0) {
            this.world.bump(xTile, yTile, this.isLarge);
            // console.log(`bump ${xTile} ${yTile}`)
        }
        return blocking;
    }


    getHurt() {
        // console.trace(`Get Hurt at ${this.world.currentTick}, ${this.invulnerableTime} x: ${this.x}, y: ${this.y}, xa: ${this.xa}, ya: ${this.ya}`)
        if (this.invulnerableTime > 0 || !this.alive)
            return;

        if (this.isLarge) {
            this.world.pauseTimer = 3 * this.POWERUP_TIME;
            this.oldLarge = this.isLarge;
            this.oldFire = this.isFire;
            if (this.isFire) {
                this.isFire = false;
            } else {
                this.isLarge = false;
            }
            this.invulnerableTime = 32;
        } else if (this.world != null) {
            if (this.world.lives <= 0) {
                this.world.lose();
            } else {
                this.world.deathBuffer = 50;
                this.xa = 0;
                this.world.lives -= 1;
                this.world.deaths += 1;
                this.world.pauseTimer = 3 * this.POWERUP_TIME;
                this.invulnerableTime = 32;
            }
        }
    }

    getDrop() {
        if (!this.alive)
            return;

        this.oldLarge = this.isLarge;
        this.oldFire = this.isFire;
        this.isFire = false;
        this.isLarge = false;
        if (this.world != null) {
            if (this.world.lives <= 0) {
                this.world.lose();
            } else if (this.invulnerableTime <= 0) {
                this.world.lives -= 1;
                this.world.deaths += 1;
                this.xa = 0;
                this.world.pauseTimer = 3 * this.POWERUP_TIME;
            }
        }
        this.invulnerableTime = 72;
    }

    getFlower() {
        if (!this.alive) {
            return;
        }

        if (!this.isFire) {
            this.world.pauseTimer = 3 * this.POWERUP_TIME;
            this.oldFire = this.isFire;
            this.oldLarge = this.isLarge;
            this.isFire = true;
            this.isLarge = true;
        } else {
            this.collectCoin();
        }
    }

    getMushroom() {
        if (!this.alive) {
            return;
        }

        if (!this.isLarge) {
            this.world.pauseTimer = 3 * this.POWERUP_TIME;
            this.oldFire = this.isFire;
            this.oldLarge = this.isLarge;
            this.isLarge = true;
        } else {
            this.collectCoin();
        }
    }

    kick(shell) {
        if (!this.alive) {
            return;
        }

        this.invulnerableTime = 1;
    }

    stomp(shell) {
        if (!this.alive) {
            return;
        }
        let targetY = shell.y - shell.height / 2;
        this.move(0, targetY - this.y);

        this.xJumpSpeed = 0;
        this.yJumpSpeed = -1.9;
        this.jumpTime = 8;
        this.ya = this.jumpTime * this.yJumpSpeed;
        this.onGround = false;
        this.invulnerableTime = 1;
    }

    getMarioType() {
        if (this.isFire) {
            return "fire";
        }
        if (this.isLarge) {
            return "large";
        }
        return "small";
    }

    collect1Up() {
        if (!this.alive) {
            return;
        }

        this.world.lives++;
    }

    collectCoin() {
        if (!this.alive) {
            return;
        }

        this.world.coins++;
        if (this.world.coins % 100 === 0) {
            this.collect1Up();
        }
    }

    clone() {
        let sprite = new Mario(false, this.x - 8, this.y - 15, this.scene, this.type);
        sprite.xa = this.xa;
        sprite.ya = this.ya;
        sprite.initialCode = this.initialCode;
        sprite.width = this.width;
        sprite.height = this.height;
        sprite.facing = this.facing;
        sprite.isLarge = this.isLarge;
        sprite.isFire = this.isFire;
        sprite.wasOnGround = this.wasOnGround;
        sprite.onGround = this.onGround;
        sprite.isDucking = this.isDucking;
        sprite.canShoot = this.canShoot;
        sprite.mayJump = this.mayJump;
        sprite.actions = Array(this.actions.length);
        for (let i = 0; i < this.actions.length; i++) {
            sprite.actions[i] = this.actions[i];
        }
        sprite.xJumpSpeed = this.xJumpSpeed;
        sprite.yJumpSpeed = this.yJumpSpeed;
        sprite.invulnerableTime = this.invulnerableTime;
        sprite.jumpTime = this.jumpTime;
        sprite.xJumpStart = this.xJumpStart;
        return sprite;
    }


    render(og) {
        super.render(og);

        this.graphics.render(og, Math.floor(this.x - this.world.cameraX), Math.floor(this.y - this.world.cameraY));
    }

}