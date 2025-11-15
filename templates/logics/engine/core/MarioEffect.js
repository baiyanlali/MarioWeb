
import Assets from "../helper/Assets.js";
import MarioImage from "../graphics/MarioImage.js";

export default class MarioEffect {
     x; y; xv; yv; xa; ya;
     life; startingIndex;
     graphics;

    constructor(x, y, xv, yv, xa, ya, startIndex, life) {
        this.x = x;
        this.y = y;
        this.xv = xv;
        this.yv = yv;
        this.xa = xa;
        this.ya = ya;
        this.life = life;

        this.graphics = new MarioImage(Assets.particles, startIndex);
        this.graphics.width = 16;
        this.graphics.height = 16;
        this.graphics.originX = 8;
        this.graphics.originY = 8;
        this.startingIndex = startIndex;
    }

    render(og, cameraX, cameraY) {
        if (this.life <= 0) {
            return;
        }
        this.life -= 1;
        this.x += this.xv;
        this.y += this.yv;
        this.xv += this.xa;
        this.yv += this.ya;

        this.graphics.render(og, Math.floor (this.x - cameraX), Math.floor (this.y - cameraY));
    }
}
