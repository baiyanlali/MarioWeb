import { EventType } from "../helper/EventType.js";
import MarioEvent from "./MarioEvent";
import MarioAgentEvent from "./MarioAgentEvent";
import { SpriteType } from "../helper/SpriteType";
import MarioForwardModel from "./MarioForwardModel";
import MarioWorld from "./MarioWorld";
export default class MarioResult {
    constructor(world, gameEvents, agentEvents) {
        this.world = world;
        this.gameEvents = gameEvents;
        this.agentEvents = agentEvents;

    }

    /**
     * @type {MarioWorld}
     */
    world;
    /**
     * @type {MarioEvent[][]}
     */
    gameEvents;
    /**
     * @type {MarioAgentEvent[]}
     */
    agentEvents;

    /**
     * @type {string}
     */
    levelString;

    /**
     * Get the current state of the running game
     *
     * @return GameStatus the current state (WIN, LOSE, TIME_OUT, RUNNING)
     */
    getGameStatus() {
        return this.world.gameStatus;
    }

    /**
     * The percentage of distance traversed between mario and the goal
     *
     * @return value between 0 to 1 to indicate the percentage of distance traversed
     */
    getCompletionPercentage() {
        return this.world.mario.x / (this.world.level.exitTileX * 16);
    }

    /**
     * Get the remaining time before the game timesout
     *
     * @return the number of time ticks before timeout each frame removes 30 frames
     */
    getRemainingTime() {
        return this.world.currentTimer / 1000;
    }

    /**
     * Get the current mario mode
     *
     * @return the current mario mode (0-small, 1-large, 2-fire)
     */
    getMarioMode() {
        let value = 0;
        if (this.world.mario.isLarge) {
            value = 1;
        }
        if (this.world.mario.isFire) {
            value = 2;
        }
        return value;
    }

    /**
     * Get all the game events that happen in the game
     *
     * @return an arrayList of all possible events that happened in a mario game
     */
    getGameEvents() {
        return this.gameEvents;
    }

    /**
     * Get all the actions that the agent has been taking during the game
     *
     * @return an arraylist that contains all the actions the agent has taken during game play
     */
    getAgentEvents() {
        return this.agentEvents;
    }

    /**
     * get the number of enemies killed in the game
     *
     * @return number of enemies killed in the game
     */
    getKillsTotal() {
        let kills = 0;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if (e.getEventType() === EventType.STOMP_KILL || e.getEventType() === EventType.FIRE_KILL ||
                    e.getEventType() === EventType.FALL_KILL || e.getEventType() === EventType.SHELL_KILL) {
                    kills += 1;
                }
            }

        }
        return kills;
    }

    /**
     * get the number of enemies killed by fireballs
     *
     * @return number of enemies killed by fireballs
     */
    getKillsByFire() {
        let kills = 0;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if (e.getEventType() === EventType.FIRE_KILL) {
                    kills += 1;
                }
            }
        }
        return kills;
    }

    /**
     * get the number of enemies killed by stomping
     *
     * @return number of enemies killed by stomping
     */
    getKillsByStomp() {
        let kills = 0;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if (e.getEventType() === EventType.STOMP_KILL) {
                    kills += 1;
                }
            }

        }
        return kills;
    }

    /**
     * get the number of enemies killed by a koopa shell
     *
     * @return number of enemies killed by a koopa shell
     */
    getKillsByShell() {
        let kills = 0;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if (e.getEventType() === EventType.SHELL_KILL) {
                    kills += 1;
                }
            }
        }
        return kills;
    }

    /**
     * get Num of kills for a certain enemy Type
     *
     * @param enemyType the enemy type from SpriteType
     * @return number of a certain type of enemy that has been killed by Mario
     */
    getMarioNumKills(enemyType) {
        let kills = 0;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if ((e.getEventType() === EventType.SHELL_KILL
                    || e.getEventType() === EventType.FIRE_KILL
                    || e.getEventType() === EventType.STOMP_KILL) && e.getEventParam() === enemyType) {
                    kills += 1;
                }
            }

        }
        return kills;
    }

    /**
     * Get number of times mario got hit by an enemy
     *
     * @return number of times mario got hurt
     */
    getMarioNumHurts() {
        let hurt = 0;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if (e.getEventType() === EventType.HURT) {
                    hurt += 1;
                }
            }
        }
        return hurt;
    }

    /**
     * Number of times mario hit question mark block
     *
     * @return number of question mark block mario hit
     */
    getNumBumpQuestionBlock() {
        let bump = 0;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if (e.getEventType() === EventType.BUMP && e.getEventParam() === MarioForwardModel.OBS_QUESTION_BLOCK) {
                    bump += 1;
                }
            }
        }
        return bump;
    }

    /**
     * Number of times mario hit brick block
     *
     * @return number of brick block mario hit
     */
    getNumBumpBrick() {
        let bump = 0;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if (e.getEventType() === EventType.BUMP && e.getEventParam() === MarioForwardModel.OBS_BRICK) {
                    bump += 1;
                }
            }
        }
        return bump;
    }

    /**
     * get the number of enemies that fell from the game screen
     *
     * @return the number of enemies that fell from the game screen
     */
    getKillsByFall() {
        let kills = 0;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if (e.getEventType() === EventType.FALL_KILL) {
                    kills += 1;
                }
            }
        }
        return kills;
    }

    /**
     * get number of jumps performed by mario during the game
     *
     * @return the number of jumps performed by mario during the game
     */
    getNumJumps() {
        let jumps = 0;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if (e.getEventType() === EventType.JUMP) {
                    jumps += 1;
                }
            }
        }
        return jumps;
    }

    /**
     * get the maximum x distance traversed by mario
     *
     * @return the maximum x distance traversed mario
     */
    getMaxXJump() {
        let maxXJump = 0;
        let startX = -100;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if (e.getEventType() === EventType.JUMP) {
                    startX = e.getMarioX();
                }
                if (e.getEventType() === EventType.LAND) {
                    if (Math.abs(e.getMarioX() - startX) > maxXJump) {
                        maxXJump = Math.abs(e.getMarioX() - startX);
                    }
                }
            }
        }
        return maxXJump;
    }

    /**
     * get the maximum amount of frames mario is being in the air
     *
     * @return the maximum amount of frames mario is being in the air
     */
    getMaxJumpAirTime() {
        let maxAirJump = 0;
        let startTime = -100;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if (e.getEventType() === EventType.JUMP) {
                    startTime = e.getTime();
                }
                if (e.getEventType() === EventType.LAND) {
                    if (e.getTime() - startTime > maxAirJump) {
                        maxAirJump = e.getTime() - startTime;
                    }
                }
            }
        }
        return maxAirJump;
    }

    /**
     * get the number 100 coins collected by mario and 1 ups found
     *
     * @return number of 100 coins collected by mario and 1 ups found
     */
    getCurrentLives() {
        return this.world.lives;
    }

    /**
     * get the number of coins that mario have by end of the game
     *
     * @return the number of coins that mario have by end of the game
     */
    getCurrentCoins() {
        return this.world.coins;
    }

    /**
     * get the number of mushroom collected by mario
     *
     * @return the number of collected mushrooms by mario
     */
    getNumCollectedMushrooms() {
        let collect = 0;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if (e.getEventType() === EventType.COLLECT && e.getEventParam() === SpriteType.MUSHROOM) {
                    collect += 1;
                }
            }
        }
        return collect;
    }

    /**
     * get the number of fire flowers collected by mario
     *
     * @return the number of collected fire flowers by mario
     */
    getNumCollectedFireflower() {
        let collect = 0;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if (e.getEventType() === EventType.COLLECT && e.getEventParam() === SpriteType.FIRE_FLOWER) {
                    collect += 1;
                }
            }
        }
        return collect;
    }

    /**
     * get the number of coins collected by mario
     *
     * @return the number of collected coins by mario
     */
    getNumCollectedTileCoins() {
        let collect = 0;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if (e.getEventType() === EventType.COLLECT && e.getEventParam() === MarioForwardModel.OBS_COIN) {
                    collect += 1;
                }
            }
        }
        return collect;
    }

    /**
     * get the number of destroyed bricks by large or fire mario
     *
     * @return the number of destroyed bricks by large or fire mario
     */
    getNumDestroyedBricks() {
        let bricks = 0;
        for (let ee of this.gameEvents) {
            for (let e of ee) {
                if (e.getEventType() === EventType.BUMP && e.getEventParam() === MarioForwardModel.OBS_BRICK && e.getMarioState() > 0) {
                    bricks += 1;
                }
            }
        }
        return bricks;
    }
}
