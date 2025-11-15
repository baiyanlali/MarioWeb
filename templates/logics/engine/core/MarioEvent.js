
export default class MarioEvent {
    eventType;
    eventParam;
    marioX;
    marioY;
    marioState;
    time;

    constructor( eventType, eventParam, x, y, state, time) {
        this.eventType = eventType;
        this.eventParam = eventParam;
        this.marioX = x;
        this.marioY = y;
        this.marioState = state;
        this.time = time;
    }

    getEventType() {
        return this.eventType;
    }

    getEventParam() {
        return this.eventParam;
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

    getTime() {
        return this.time;
    }

    equals(obj) {
        let otherEvent = obj;
        return this.eventType === otherEvent.eventType &&
                (this.eventParam === 0 || this.eventParam === otherEvent.eventParam);
    }
}
