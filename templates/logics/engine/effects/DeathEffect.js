
import MarioEffect from "../core/MarioEffect.js";

export default class DeathEffect extends MarioEffect {
    constructor( x,  y,  flipX,  startIndex,  yv) {
    super(x, y, 0, yv, 0, 1.0, startIndex, 30);
    this.graphics.flipX = flipX;
    }
}