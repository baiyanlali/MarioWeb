
import MarioGraphics from "./MarioGraphics.js";
import Assets from "../helper/Assets.js";

function createCompatibleCanvas(width, height, bala) {
    var compatibleCanvas = document.createElement('canvas');
    compatibleCanvas.width = width;
    compatibleCanvas.height = height;
    return compatibleCanvas;
}


// export default class MarioBackground extends MarioGraphics {
//      image;
//      g;
//      screenWidth;

//     constructor(graphicsConfiguration,  screenWidth,  indeces) {
//         super();
//         this.width = indeces[0].length * 16;
//         this.height = indeces.length * 16;
//         this.screenWidth = screenWidth;

//         // this.image = graphicsConfiguration.createCompatibleImage(width, height, Transparency.BITMASK);
//         this.image = createCompatibleCanvas(this.width, this.height, null);
//         this.g = this.image.getGraphics();
//         this.g.setComposite(AlphaComposite.Src);

//         this.updateArea(indeces);
//     }

//     updateArea(indeces) {
//         g.setBackground(new Color(0, 0, 0, 0));
//         g.clearRect(0, 0, this.width, this.height);
//         for (let x = 0; x < indeces[0].length; x++) {
//             for (let y = 0; y < indeces.length; y++) {
//                 let xTile = indeces[y][x] % 8;
//                 let yTile = indeces[y][x] / 8;
//                 g.drawImage(Assets.level[xTile][yTile], x * 16, y * 16, 16, 16);
//             }
//         }
//     }

//     /**
//      * 
//      * @param {CanvasRenderingContext2D} og 
//      * @param {number} x 
//      * @param {number} y 
//      */

//     render( og,  x,  y) {
//         let xOff = x % this.width;
//         for (let i = -1; i < this.screenWidth / this.width + 1; i++) {
//             og.drawImage(this.image, -xOff + i * this.width, 0);
//         }
//     }

// }


export default class MarioBackground extends MarioGraphics{
    constructor(context, screenWidth, indeces) {
        super();
        this.context = context;
        this.width = indeces[0].length * 16;
        this.height = indeces.length * 16;
        this.screenWidth = screenWidth;

        this.image = this.createCompatibleImage(this.width, this.height);
        this.g = this.image.getContext('2d');
        this.g.globalCompositeOperation = 'source-over';

        this.updateArea(indeces);
    }

    createCompatibleImage(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    updateArea(indeces) {

        this.g.clearRect(0, 0, this.width, this.height);
        for (let x = 0; x < indeces[0].length; x++) {
            for (let y = 0; y < indeces.length; y++) {
                let xTile = indeces[y][x] % 8;
                let yTile = Math.floor(indeces[y][x] / 8);
                this.g.drawImage(Assets.level[xTile][yTile], x * 16, y * 16, 16, 16);
            }
        }
    }

    render(context, x, y) {
        let xOff = x % this.width;
        for (let i = -1; i < this.screenWidth / this.width + 1; i++) {
            context.drawImage(this.image, -xOff + i * this.width, 0);
        }
    }
}

// // Usage example
// // Assuming you have a 2D context from a canvas element and Assets.level is properly defined

// const canvas = document.getElementById('gameCanvas');
// const context = canvas.getContext('2d');
// const screenWidth = canvas.width;

// const indeces = [
//     [0, 1, 2, 3, 4, 5, 6, 7],
//     [8, 9, 10, 11, 12, 13, 14, 15],
//     // more rows as needed
// ];

// const background = new MarioBackground(context, screenWidth, indeces);

// function gameLoop() {
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     background.render(context, 0, 0);
//     requestAnimationFrame(gameLoop);
// }

// gameLoop();

