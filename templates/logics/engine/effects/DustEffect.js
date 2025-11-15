class DustEffect extends MarioEffect {
    constructor( x,  y) {
    super(x, y,
        parseFloat((Math.random() * 2 - 1), parseFloat(Math.random() * -1), 0, 0, 8 + parseInt(Math.random() * 2), 10 + (int) (Math.random() * 5))
    );
}

render(og,  cameraX,  cameraY) {
    if (this.life > 10) {
        this.graphics.index = 7;
    } else {
        this.graphics.index = this.startingIndex + (10 - life) * 4 / 10;
    }
    super.render(og, cameraX, cameraY);
}
}