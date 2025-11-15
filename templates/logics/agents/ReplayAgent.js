import MarioAgent from "../engine/core/MarioAgent.js";

export default class ReplayAgent extends MarioAgent{
    actions;
    isPressed = false;
    p = 0;
    constructor(actions) {
        super();
        //默认第0帧不动
        this.actions = [[false, false, false, false, false, false], ...actions]
        // this.actions = [...actions]
    }

    getActions(model, timer) {
        if(!this.isPressed){
            // console.log(`get actions: ${this.p}/${this.actions.length} ${this.actions[this.p]}`)
            if(this.p >= this.actions.length)
                return [false, false, false, false, false, false]
            return this.actions[this.p++]
        }else{
            return [false, true, true, true, true, true]
        }
    }

    getAgentName() {
        return "ReplayAgent"
    }

    reset() {
        this.p = 0;
        this.isPressed = false;
    }

}