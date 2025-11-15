export default class MarioGraphics {
    visible;
    alpha;
    originX; originY;
    flipX; flipY;
    width; height;

    constructor() {
        this.visible = true;
        this.alpha = 1;
        this.originX = this.originY = 0;
        this.flipX = this.flipY = false;
        this.width = this.height = 32;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} og 
     * @param {number} x 
     * @param {number} y 
     */
    render(og, x, y){}
}