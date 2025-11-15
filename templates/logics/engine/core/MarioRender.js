import MarioWorld from "./MarioWorld.js";
import Assets from "../helper/Assets.js";
const TICKS_PER_SECOND = 24;


let lastDownTarget = null;

export default class MarioRender {
    target_og;
    canvas;
    og;
    /**
     * 
     * @param {number} scaling_factor 
     * @param {*} onInput 
     * @param {HTMLDivElement} parent_div 
     */
    constructor(scaling_factor = 1, onInput = (key, pressed) => { }, parent_div = null) {
        this.size = [256, 240]
        // this.canvas = document.createElement("canvas") document.getElementById("mario_canvas")

        this.canvas = document.createElement("canvas")
        this.og = this.canvas.getContext("2d")
        this.canvas.setAttribute("width", this.size[0])
        this.canvas.setAttribute("height", this.size[1])

        this.target_og = document.createElement("canvas")
        this.onChangeScale(scaling_factor)
        this.target_og.setAttribute("width", scaling_factor * this.size[0])
        this.target_og.setAttribute("height", scaling_factor * this.size[1])

        const destinationCtx = this.target_og.getContext('2d');
        if (destinationCtx) {
            destinationCtx.imageSmoothingEnabled = false; // 兼容性设置
            destinationCtx['webkitImageSmoothingEnabled'] = false;
            destinationCtx['mozImageSmoothingEnabled'] = false;
            destinationCtx['msImageSmoothingEnabled'] = false;
            destinationCtx['oImageSmoothingEnabled'] = false;
        }
        
        parent_div.appendChild(this.target_og)


        document.addEventListener('mousedown', (event) => {
            lastDownTarget = event.target;
        }, false)

        document.addEventListener('keydown', (event) => {
            // console.log("keydown", event.key)
            // if (lastDownTarget == this.target_og)
                onInput(event.key, true);
        }, false);

        document.addEventListener('keyup', (event) => {
            // if (lastDownTarget == this.target_og)
                onInput(event.key, false);
        }, false);
    }

    destroy() {
        this.target_og.remove()
        this.canvas.remove()
    }

    onChangeScale(scaling_factor = 1) {
        this.target_og.setAttribute("width", scaling_factor * this.size[0])
        this.target_og.setAttribute("height", scaling_factor * this.size[1])
    }

    async init() {
        await Assets.init()
    }

    /**
     * 
     * @param {MarioWorld} world 
     * @param {*} image 
     * @param {*} g 
     * @param {CanvasRenderingContext2D} og 
     * @param {boolean} verbose 
     */
    renderWorld(world, image, g, og = this.og, verbose = false) {
        og.fillRect(0, 0, 256, 240)
        world.render(og)

        this.target_og.getContext("2d").drawImage(this.canvas, 0, 0, this.size[0], this.size[1], 0, 0, this.target_og.width, this.target_og.height)
    }
}