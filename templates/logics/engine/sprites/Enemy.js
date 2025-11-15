import MarioSprite from "../core/MarioSprite.js";
import { SpriteType } from "../helper/SpriteType.js";
import {EventType} from "../helper/EventType.js";
import MarioImage from "../graphics/MarioImage.js";
import Assets from "../helper/Assets.js";
import SquishEffect from "../effects/SquishEffect.js";
import DeathEffect from "../effects/DeathEffect.js";
import Shell from "./Shell.js";
export default class Enemy extends MarioSprite {
    static GROUND_INERTIA = 0.89;
    static AIR_INERTIA = 0.89;

    onGround = false;
    avoidCliffs = true;
    winged = true;
    noFireballDeath;

    runTime = 0;
    wingTime = 0;
    wingGraphics = new MarioImage(Assets.enemies, 32);
    graphics = new MarioImage(Assets.enemies, this.type[1]);

    constructor(visuals, x, y, dir, scene, type) {
        super(x, y, scene);
        this.world = scene;
        this.type = type
        this.width = 4;
        this.height = 24;
        if (this.type !== SpriteType.RED_KOOPA && this.type !== SpriteType.GREEN_KOOPA
            && this.type !== SpriteType.RED_KOOPA_WINGED && this.type !== SpriteType.GREEN_KOOPA_WINGED) {
            this.height = 12;
        }
        this.winged = this.type[0] % 2 === 1;
        this.avoidCliffs = this.type === SpriteType.RED_KOOPA || this.type === SpriteType.RED_KOOPA_WINGED;
        this.noFireballDeath = this.type === SpriteType.SPIKY || this.type === SpriteType.SPIKY_WINGED;
        this.facing = dir;
        if (this.facing === 0) {
            this.facing = 1;
        }

        if (visuals) {
            this.graphics = new MarioImage(Assets.enemies, this.type[1]);
            this.graphics.originX = 8;
            this.graphics.originY = 31;
            this.graphics.width = 16;

            this.wingGraphics = new MarioImage(Assets.enemies, 32);
            this.wingGraphics.originX = 16;
            this.wingGraphics.originY = 31;
            this.wingGraphics.width = 16;
        }


    }

    clone() {
        let e = new Enemy(false, this.x, this.y, this.facing, this.type);
        e.xa = this.xa;
        e.ya = this.ya;
        e.initialCode = this.initialCode;
        e.width = this.width;
        e.height = this.height;
        e.onGround = this.onGround;
        e.winged = this.winged;
        e.avoidCliffs = this.avoidCliffs;
        e.noFireballDeath = this.noFireballDeath;
        return e;
    }

    collideCheck() {
        if (!this.alive) {
            return;
        }

        let xMarioD = this.world.mario.x - this.x;
        let yMarioD = this.world.mario.y - this.y;
        if (xMarioD > -this.width * 2 - 4 && xMarioD < this.width * 2 + 4) {
            // if(this.world.currentTick === 563 || this.world.currentTick === 564){
            //     console.log(`${this.world.currentTick} HIT ${this.x}, ${this.y} | ${xMarioD} ${yMarioD}, ${this.height}, ${this.world.mario.height} ${this.type}`)
            // }
            if (yMarioD > -this.height && yMarioD < this.world.mario.height) {
                if (this.type !== SpriteType.SPIKY && this.type !== SpriteType.SPIKY_WINGED && this.type !== SpriteType.ENEMY_FLOWER &&
                    this.world.mario.ya > 0 && yMarioD <= 0 && (!this.world.mario.onGround || !this.world.mario.wasOnGround)) {
                    this.world.mario.stomp(this);
                    if (this.winged) {
                        this.winged = false;
                        this.ya = 0;
                    } else {
                        if (this.type === SpriteType.GREEN_KOOPA || this.type === SpriteType.GREEN_KOOPA_WINGED) {
                            this.world.addSprite(new Shell(this.graphics !== null, this.x, this.y, 1, this.initialCode));
                        } else if (this.type === SpriteType.RED_KOOPA || this.type === SpriteType.RED_KOOPA_WINGED) {
                            this.world.addSprite(new Shell(this.graphics !== null, this.x, this.y, 0, this.initialCode));
                        } else if (this.type === SpriteType.GOOMBA || this.type === SpriteType.GOOMBA_WINGED) {
                            if (this.graphics !== null) {
                                this.world.addEffect(new SquishEffect(this.x, this.y - 7));
                            }
                        }
                        this.world.addEvent(EventType.STOMP_KILL, this.type[0]);
                        this.world.removeSprite(this);
                    }
                } else {
                    this.world.addEvent(EventType.HURT, this.type[0]);
                    this.world.mario.getHurt();
                }
            }
        }
    }

    updateGraphics() {
        this.wingTime++;
        this.wingGraphics.index = 32 + Math.floor(this.wingTime / 4) % 2;

        this.graphics.flipX = this.facing === -1;
        this.runTime += (Math.abs(this.xa)) + 5;

        let runFrame = (Math.floor(this.runTime / 20)) % 2;


        if (!this.onGround) {
            runFrame = 1;
        }
        if (this.winged)
            runFrame = Math.floor(this.wingTime / 4) % 2;

        this.graphics.index = this.type[1] + runFrame;
    }

    update() {
        if (!this.alive) {
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

        this.ya *= this.winged ? 0.95 : 0.85;
        if (this.onGround) {
            this.xa *= Enemy.GROUND_INERTIA;
        } else {
            this.xa *= Enemy.AIR_INERTIA;
        }

        if (!this.onGround) {
            if (this.winged) {
                this.ya += 0.6;
            } else {
                this.ya += 2;
            }
        } else if (this.winged) {
            this.ya = -10;
        }

        if (this.graphics !== null) {
            this.updateGraphics();
        }
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

            if (this.avoidCliffs && this.onGround
                && !this.world.level.isBlocking(Math.floor((this.x + xa + this.width) / 16), Math.floor((this.y) / 16 + 1), xa, 1))
                collide = true;
        }
        if (xa < 0) {
            if (this.isBlocking(this.x + xa - this.width, this.y + ya - this.height, xa, ya))
                collide = true;
            if (this.isBlocking(this.x + xa - this.width, this.y + ya - this.height / 2, xa, ya))
                collide = true;
            if (this.isBlocking(this.x + xa - this.width, this.y + ya, xa, ya))
                collide = true;

            if (this.avoidCliffs && this.onGround
                && !this.world.level.isBlocking(Math.floor((this.x + xa - this.width) / 16), Math.floor((this.y) / 16 + 1), xa, 1))
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
                this.ya = 0;
            }
            if (ya > 0) {
                this.y = Math.floor(this.y / 16 + 1) * 16 - 1;
                this.onGround = true;
            }
            return false;
        } else {
            this.x += xa;
            this.y += ya;
            return true;
        }
    }

    isBlocking(_x, _y, xa, ya) {
        let x = Math.floor(_x / 16);
        let y = Math.floor(_y / 16);
        if (x === Math.floor(this.x / 16) && y === Math.floor(this.y / 16))
            return false;

        let blocking = this.world.level.isBlocking(x, y, xa, ya);

        return blocking;
    }

    shellCollideCheck(shell) {
        if (!this.alive) {
            return false;
        }

        let xD = shell.x - this.x;
        let yD = shell.y - this.y;

        if (xD > -16 && xD < 16) {
            if (yD > -this.height && yD < shell.height) {
                this.xa = shell.facing * 2;
                this.ya = -5;
                this.world.addEvent(EventType.SHELL_KILL, this.type[0]);
                if (this.graphics !== null) {
                    if (this.type === SpriteType.GREEN_KOOPA || this.type === SpriteType.GREEN_KOOPA_WINGED) {
                        this.world.addEffect(new DeathEffect(this.x, this.y, this.graphics.flipX, 42, -5));
                    } else if (this.type === SpriteType.RED_KOOPA || this.type === SpriteType.RED_KOOPA_WINGED) {
                        this.world.addEffect(new DeathEffect(this.x, this.y, this.graphics.flipX, 41, -5));
                    } else if (this.type === SpriteType.GOOMBA || this.type === SpriteType.GOOMBA_WINGED) {
                        this.world.addEffect(new DeathEffect(this.x, this.y, this.graphics.flipX, 44, -5));
                    } else if (this.type === SpriteType.SPIKY || this.type === SpriteType.SPIKY_WINGED) {
                        this.world.addEffect(new DeathEffect(this.x, this.y, this.graphics.flipX, 45, -5));
                    }
                }
                this.world.removeSprite(this);
                return true;
            }
        }
        return false;
    }

    fireballCollideCheck(fireball) {
        if (!this.alive) {
            return false;
        }

        let xD = fireball.x - this.x;
        let yD = fireball.y - this.y;

        if (xD > -16 && xD < 16) {
            if (yD > -this.height && yD < fireball.height) {
                if (this.noFireballDeath)
                    return true;

                this.xa = fireball.facing * 2;
                this.ya = -5;
                this.world.addEvent(EventType.FIRE_KILL, this.type[0]);
                if (this.graphics !== null) {
                    if (this.type === SpriteType.GREEN_KOOPA || this.type === SpriteType.GREEN_KOOPA_WINGED) {
                        this.world.addEffect(new DeathEffect(this.x, this.y, this.graphics.flipX, 42, -5));
                    } else if (this.type === SpriteType.RED_KOOPA || this.type === SpriteType.RED_KOOPA_WINGED) {
                        this.world.addEffect(new DeathEffect(this.x, this.y, this.graphics.flipX, 41, -5));
                    } else if (this.type === SpriteType.GOOMBA || this.type === SpriteType.GOOMBA_WINGED) {
                        this.world.addEffect(new DeathEffect(this.x, this.y, this.graphics.flipX, 44, -5));
                    }
                }
                this.world.removeSprite(this);
                return true;
            }
        }
        return false;
    }

    bumpCheck(xTile, yTile) {
        if (!this.alive) {
            return;
        }

        if (this.x + this.width > xTile * 16 && this.x - this.width < xTile * 16 + 16 && yTile === Math.floor((this.y - 1) / 16)) {
            this.xa = -this.world.mario.facing * 2;
            this.ya = -5;
            if (this.graphics !== null) {
                if (this.type === SpriteType.GREEN_KOOPA || this.type === SpriteType.GREEN_KOOPA_WINGED) {
                    this.world.addEffect(new DeathEffect(this.x, this.y, this.graphics.flipX, 42, -5));
                } else if (this.type === SpriteType.RED_KOOPA || this.type === SpriteType.RED_KOOPA_WINGED) {
                    this.world.addEffect(new DeathEffect(this.x, this.y, this.graphics.flipX, 41, -5));
                } else if (this.type === SpriteType.GOOMBA || this.type === SpriteType.GOOMBA_WINGED) {
                    this.world.addEffect(new DeathEffect(this.x, this.y, this.graphics.flipX, 44, -5));
                } else if (this.type === SpriteType.SPIKY || this.type === SpriteType.SPIKY_WINGED) {
                    this.world.addEffect(new DeathEffect(this.x, this.y, this.graphics.flipX, 45, -5));
                }
            }
            this.world.removeSprite(this);
        }
    }

    render(og) {
        if (this.winged) {
            if (this.type !== SpriteType.RED_KOOPA && this.type !== SpriteType.GREEN_KOOPA && this.type !== SpriteType.RED_KOOPA_WINGED
                && this.type !== SpriteType.GREEN_KOOPA_WINGED) {
                this.wingGraphics.flipX = false;
                this.wingGraphics.render(og, Math.floor(this.x - this.world.cameraX - 6), Math.floor(this.y - this.world.cameraY - 6));
                this.wingGraphics.flipX = true;
                this.wingGraphics.render(og, Math.floor(this.x - this.world.cameraX + 22), Math.floor(this.y - this.world.cameraY - 6));
            }
        }


        this.graphics.render(og, Math.floor(this.x - this.world.cameraX), Math.floor(this.y - this.world.cameraY));

        if (this.winged) {
            if (this.type === SpriteType.RED_KOOPA || this.type === SpriteType.GREEN_KOOPA || this.type === SpriteType.RED_KOOPA_WINGED
                || this.type === SpriteType.GREEN_KOOPA_WINGED) {
                let shiftX = -1;
                if (this.graphics.flipX) {
                    shiftX = 17;
                }
                this.wingGraphics.flipX = this.graphics.flipX;
                this.wingGraphics.render(og, Math.floor(this.x - this.world.cameraX + shiftX), Math.floor(this.y - this.world.cameraY - 8));
            }
        }
    }

}