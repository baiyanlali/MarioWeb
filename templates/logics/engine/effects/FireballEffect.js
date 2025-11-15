import MarioEffect from "../core/MarioEffect.js";

export default class FireballEffect extends MarioEffect {
    constructor( x,  y) {
        super(x, y, 0, 0, 0, 0, 32, 8);
    }

    render( og,  cameraX,  cameraY) {
        this.graphics.index = this.startingIndex + (8 - this.life);
        super.render(og, cameraX, cameraY);
    }
}