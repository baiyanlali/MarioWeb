
/**
 * Mario timer object used to control the agents so they won't exceed the allowed time.
 *
 * @author AhmedKhalifa
 */
export class MarioTimer {
    startTimer;
    remainingTime;

    /**
     * Start a timer
     *
     * @param remainingTime the amount of milliseconds before the timer runs out
     */
    constructor(remainingTime) {
    this.startTimer = Date.now();
    this.remainingTime = remainingTime;
}

/**
 * Get the remaining time in that timer since construction
 *
 * @return number of milliseconds remaining in that timer.
 */
getRemainingTime() {
    return Math.max(0, this.remainingTime - (Date.now() - this.startTimer));
}
}
