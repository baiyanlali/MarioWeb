
import { drawImage } from "../../Util.js";
import MarioGraphics from "./MarioGraphics.js";

export default class MarioImage extends MarioGraphics {
    sheet;
    index;

    constructor(sheet, index) {
        super();
        this.sheet = sheet;
        this.index = index;
    }

    render(og, x, y) {
        // console.log(this.visible)
        if (!this.visible) {
            return;
        }

        let xPixel = x - this.originX;
        let yPixel = y - this.originY;
        // console.log(this.index, this.index % this.sheet.length, Math.floor(this.index / this.sheet.length))
        let image = this.sheet[this.index % this.sheet.length][Math.floor(this.index / this.sheet.length)];

        // if(this.sheet == Assets.smallMario){
        //     console.log(xPixel + (this.flipX ? this.width : 0), 
        //     yPixel + (this.flipY ? this.height : 0), 
        //     this.flipX ? -this.width : this.width, 
        //     this.flipY ? -this.height : this.height,
        //     this.flipX, this.flipY)
        // }
        
        // og.save();
        // og.scale(
        //     this.flipX? -1: 1,
        //     this.flipY? -1: 1,
        // );

        // og.scale(
        //     -1,
        //     1,
        // );

        // og.drawImage(image, 
        //     xPixel + (this.flipX ? this.width : 0), 
        //     yPixel + (this.flipY ? this.height : 0), 
        //     this.width, 
        //     this.height);

        drawImage(
            og,
            image, 
            xPixel, 
            yPixel, 
            this.width, 
            this.height,
            0,
            this.flipX,
            false
        );
        // og.drawImage(image, 
        //     xPixel, 
        //     yPixel, 
        //     this.width, 
        //     this.height,
        //     0,
        //     true,
        //     false
        // );
        // og.restore();
    }

}
