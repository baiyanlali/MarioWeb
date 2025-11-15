import MarioEffect from "../core/MarioEffect.js";
export default class CoinEffect extends MarioEffect {
    constructor( x,  y) {
        super(x, y, 0, -8.0, 0, 1, 0, 16);
    }

    render( og,  cameraX,  cameraY) {
        this.graphics.index = this.startingIndex + this.life & 3;
        super.render(og, cameraX, cameraY);
    }
}