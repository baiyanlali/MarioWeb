import MarioAgent from "../engine/core/MarioAgent.js";
import {MarioActions} from "../engine/helper/MarioActions.js";

const W = 'w'
const S = 's'
const A = 'a'
const D = 'd'
const J = 'j'
const K = 'k'
const Z = 'z'
const X = 'x'
const UP = 'arrowUp'
const DOWN = 'arrowDown'
const LEFT = 'arrowLeft'
const RIGHT = 'arrowRight'


const actionMap = {
    // WASD
    A: MarioActions.LEFT[0],
    D: MarioActions.RIGHT[0],
    S: MarioActions.DOWN[0],
    J: MarioActions.JUMP[0],
    K: MarioActions.SPEED[0],

    //ARROW
    DOWN: MarioActions.DOWN[0],
    LEFT: MarioActions.LEFT[0],
    RIGHT: MarioActions.RIGHT[0],
    X: MarioActions.SPEED[0],
    Z: MarioActions.JUMP[0],
}

export default class HumanAgent extends MarioAgent {
    actions;
    isPressed = false;
    p = 0;

    gameScene ;

    setGameScene(){

    }

    constructor(gameScene) {
        super();
        this.actions = new Array(5)
        // gameScene.input.keyboard.on('keydown', event => {
        //     this.toggleKey(event.key, true)
        // });

        // gameScene.input.keyboard.on('keyup', event => {
        //     this.toggleKey(event.key, false)
        // });
    }

    toggleKey(key, isPressed) {
        switch (key) {
            case A:
            case LEFT:
                this.actions[MarioActions.LEFT[0]] = isPressed
                break;
            case D:
            case RIGHT:
                this.actions[MarioActions.RIGHT[0]] = isPressed
                break;
            case S:
            case DOWN:
                this.actions[MarioActions.DOWN[0]] = isPressed
                break;
            case K:
            case X:
                this.actions[MarioActions.SPEED[0]] = isPressed
                break;
            case J:
            case Z:
                this.actions[MarioActions.JUMP[0]] = isPressed
                break;
        }
    }

    getActions(model, timer) {
        if (!this.isPressed) {
            return JSON.parse(JSON.stringify(this.actions))
        } else {
            return [true, false, true, true, true, true]
        }
    }

    getAgentName() {
        return "HumanAgent"
    }

}