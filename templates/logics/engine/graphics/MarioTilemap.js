import MarioGraphics from "./MarioGraphics.js";
import MarioGame from "../core/MarioGame.js";
import { New2DArray } from "../../Util.js";
import {TileFeature} from "../helper/TileFeature.js";
export default class MarioTilemap extends MarioGraphics {
     sheet;
     currentIndeces;
     indexShift;
     moveShift;
     animationIndex;

    constructor( sheet,  currentIndeces) {
        super()
        this.sheet = sheet;
        this.currentIndeces = currentIndeces;
        // console.log(currentIndeces)
        this.indexShift = New2DArray(currentIndeces.length, currentIndeces[0].length, 0);
        this.moveShift = New2DArray(currentIndeces.length, currentIndeces[0].length, 0);
        this.animationIndex = 0;
    }

    updateLevel( currentIndeces) {
        this.currentIndeces = currentIndeces;
        this.indexShift = New2DArray(currentIndeces.length, currentIndeces[0].length, 0);
        this.moveShift = New2DArray(currentIndeces.length, currentIndeces[0].length, 0);
        this.animationIndex = 0;
    }

    render( og,  x,  y) {
        this.animationIndex = (this.animationIndex + 1) % 5;

        let xMin = Math.floor(x / 16) - 1;
        let yMin = Math.floor(y / 16) - 1;
        let xMax = Math.floor((x + MarioGame.width) / 16) + 1;
        let yMax = Math.floor((y + MarioGame.height) / 16) + 1;

        // console.log(xMin, yMin, xMax, yMax)
        // console.log(this.indexShift)

        for (let xTile = xMin; xTile <= xMax; xTile++) {
            for (let yTile = yMin; yTile <= yMax; yTile++) {
                if (xTile < 0 || yTile < 0 || xTile >= this.currentIndeces.length || yTile >= this.currentIndeces[0].length) {
                    continue;
                }
                if (this.moveShift[xTile][yTile] > 0) {
                    this.moveShift[xTile][yTile] -= 1;
                    if (this.moveShift[xTile][yTile] < 0) {
                        this.moveShift[xTile][yTile] = 0;
                    }
                }
                let features = TileFeature.getTileType(this.currentIndeces[xTile][yTile]);
                if (features.includes(TileFeature.ANIMATED)) {
                    if (this.animationIndex == 0) {
                        this.indexShift[xTile][yTile] = (this.indexShift[xTile][yTile] + 1) % 3;
                    }
                } else {
                    this.indexShift[xTile][yTile] = 0;
                }
                let index = this.currentIndeces[xTile][yTile] + this.indexShift[xTile][yTile];
                let move = parseInt(this.moveShift[xTile][yTile]);
                let img = this.sheet[index % 8][Math.floor(index / 8)];
                og.drawImage(img, xTile * 16 - x, yTile * 16 - y - move);
            }
        }
    }

}
