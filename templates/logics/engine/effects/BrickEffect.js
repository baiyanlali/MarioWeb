import MarioEffect from "../core/MarioEffect.js";

export class BrickEffect extends MarioEffect {

    constructor( x,  y,  xv,  yv) {
        super(x, y, xv, yv, 0, 3, 16, 10);
    }


    render( og,  cameraX,  cameraY) {
        this.graphics.index = this.startingIndex + this.life % 4;
        this.ya *= 0.95;
        super.render(og, cameraX, cameraY);
    }

}