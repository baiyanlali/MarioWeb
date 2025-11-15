
export default class MarioAgentEvent {
    actions;
    marioX;
    marioY;
    marioState;
    marioOnGround;
    time;

    constructor(actions, marioX, marioY, marioState, marioOnGround, time) {
        this.actions = actions;
        this.marioX = marioX;
        this.marioY = marioY;
        this.marioState = marioState;
        this.marioOnGround = marioOnGround;
        this.time = time;
    }

    getActions() {
        return this.actions;
    }

    getMarioX() {
        return this.marioX;
    }

    getMarioY() {
        return this.marioY;
    }

    getMarioState() {
        return this.marioState;
    }

    getMarioOnGround() {
        return this.marioOnGround;
    }

    getTime() {
        return this.time;
    }
}
