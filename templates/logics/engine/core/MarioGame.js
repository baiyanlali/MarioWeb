import MarioWorld from "./MarioWorld.js";
import { GameStatus } from "../helper/GameStatus.js";
import Replay from "../helper/Replay.js";
import MarioResult from "./MarioResult.js";
import { MarioTimer } from "./MarioTimer.js";
import MarioAgentEvent from "./MarioAgentEvent.js";
import HumanAgent from "../../agents/HumanAgent.js";
import MarioRender from "./MarioRender.js";
import MarioAgent from "./MarioAgent.js";
import { appendLevel, sleep } from "../../../Utils";

export default class MarioGame {
    /**
     * the maximum time that agent takes for each step
     */
    static maxTime = 40;
    /**
     * extra time before reporting that the agent is taking more time that it should
     */
    static graceTime = 10;
    /**
     * Screen width
     */
    static width = 256;
    /**
     * Screen height
     */
    static height = 256;
    /**
     * Screen width in tiles
     */
    static tileWidth = this.width / 16;
    /**
     * Screen height in tiles
     */
    static tileHeight = this.height / 16;
    /**
     * print debug details
     */
    static verbose = false;

    levelString = "";

    /**
     * pauses the whole game at any moment
     */
    pause = false;

    /**
     * events that kills the player when it happens only care about type and param
     */
    killEvents;

    //visualization
    window = null;
    /**@type {MarioRender} */
    render;
    /**@type {MarioAgent} */
    agent;
    /**@type {MarioWorld} */
    world;
    initialLives;

    onGameEnd;

    maxOnlineGenCount = 20; // 最大在线生成数量
    currentOnlineGenCount = 0; // 当前在线生成数量

    // 添加在线更新相关属性
    /**@type {(() => Promise<string>) | null} */
    onRequireNewSegment = async () => {
        await sleep(50); // 模拟网络请求延迟
        return `----------------------------------------
----------------------------------------
----------------------------------------
SSS---S---------------------------------
------------------------------oo--------
----------------------------------------
--------------------QSo----------------S
----------#-----------------------------
----------#-----------------------------
---------##-----------------------------
--------###----------------------------Q
-------###-------------U----------------
-----#####------------------------------
-----#####------------------------------
-XXXXXXXXX-----XXXXXXXXXXXXXXXXXXXXXXXXX
XXXXXXXXXX------XXXXXXXXXXXXXXXX-------X`;
    }; // 回调函数，用于请求新的关卡片段
    segmentWidth = 32; // 每个片段的宽度（以瓦片为单位）
    triggerDistance = 32; // 触发距离（距离关卡末尾多少瓦片时开始请求新片段）
    isLoadingSegment = false; // 是否正在加载新片段

    /**
     * Create a mario game with a different forward model where the player on certain event
     * @param {HTMLDivElement} parent_div 
     * @param {Array<any>} killEvents events that will kill the player
     * @param {number} [lives=5] 
     * @param {number} [scaling_factor=2] 
     */
    constructor(parent_div, killEvents = [], lives = 0, scaling_factor = 1.5) {
        this.killEvents = killEvents;
        this.initialLives = lives;
        this.lives = lives;

        this.render = new MarioRender(scaling_factor, this.hold_input, parent_div);
    }

    destroy() {
        this.render.destroy()
    }

    /**
     * Reset the game to its initial state, including level, lives, agent, and world.
     */
    reset() {
        this.lives = this.initialLives;
        if (this.world) {
            this.world.resetLevel && this.world.resetLevel();
            this.world.lives = this.initialLives;
            this.world.mario.isLarge = false;
            this.world.mario.isFire = false;
            this.world.currentTick = 0;
            this.world.deathBuffer = 0;
            this.world.gameStatus = GameStatus.RUNNING;
            // this.world.level && (this.world.level = JSON.parse(JSON.stringify(this.world.level)));
        }
        this.pause = false;
        this.gameEvents = [];
        this.agentEvents = [];
        this.replayBreak = false;
        this.cheatBreak = false;
        this.segNum = 0;
        this.timer = 0;
        if (this.agent && typeof this.agent.reset === "function") {
            this.agent.reset();
        }
    }

    async init() {
        await this.render.init()
        this.currentOnlineGenCount = 0;
        this.world = new MarioWorld(null, {
            key: "SceneMain",
            active: true,
            visible: true
        })
    }


    getDelay(fps) {
        if (fps <= 0) {
            return 0;
        }
        return 1000 / fps;
    }

    setAgent(agent) {
        this.agent = agent;
        // if (agent instanceof KeyAdapter) {
        //     this.render.addKeyListener(this.agent);
        // }
    }

    /**
     * Play a certain mario level
     *
     * @param gameAgent MarioAgent
     * @param level a that constitutes the mario level, it uses the same representation as the VGLC but with more details. for more details about each symbol check the json file in the levels folder.
     * @param timer number of ticks for that level to be played. Setting timer to anything &lt;=0 will make the time infinite
     * @param resultPath
     * @param col
     * @return statistics about the current game
     */
    playGame(gameAgent, level, timer, resultPath, col) {
        return this.runGame(gameAgent, level, timer, 0, true, 60, 2, resultPath, col);
    }

    /**
     * Build level
     *
     * @param level      a that constitutes the mario level, it uses the same representation as the VGLC but with more details. for more details about each symbol check the json file in the levels folder.
     * @return statistics about the current game
     */
    async buildLevel(level, timer, resultPath, col) {

        this.world.level = level;
        this.levelString = level;
        // this.setAgent(agent);

        this.world.onReady = () => {
            const humanagent = new HumanAgent(this.world)
            this.setAgent(humanagent)
            this.gameLoop(level, timer, 0, true, 60, resultPath, col)
            this.world.onUpdate = null;
            this.world.update_(null, true);
            this.render.renderWorld(this.world, null, null, this.render.og);
            // this.worldUpdate()
        }
        this.world.create()
    }

    humanPlayGame(onGameEnd) {
        this.world.setCurrentTimer(this.timer * 1000);
        this.world.onUpdate = this.worldUpdate.bind(this);
        this.onGameEnd = onGameEnd;
    }

    /**
     * Run a certain mario level with a certain agent
     *
     * @param agent      the current AI agent used to play the game
     * @param level      a that constitutes the mario level, it uses the same representation as the VGLC but with more details. for more details about each symbol check the json file in the levels folder.
     * @param timer      number of ticks for that level to be played. Setting timer to anything &lt;=0 will make the time infinite
     * @param marioState the initial state that mario appears in. 0 small mario, 1 large mario, and 2 fire mario.
     * @param visuals    show the game visuals if it is true and false otherwise
     * @param fps        the number of frames per second that the update function is following
     * @param scale      the screen scale, that scale value is multiplied by the actual width and height
     * @param resultPath
     * @param col
     * @return statistics about the current game
     */
    async runGame(agent, level, timer, marioState, visuals, fps, scale, resultPath, col) {
        // if (visuals) {
        //     this.render = new MarioRender(1, this.hold_input)
        //     await this.render.init()

        //     this.world = new MarioWorld(null, {
        //         key: "SceneMain",
        //         active: true,
        //         visible: true
        //     })
        // }
        this.world.level = level;
        this.levelString = level;
        this.setAgent(agent);

        this.world.onReady = () => {
            this.gameLoop(level, timer, marioState, visuals, fps, resultPath, col)
            // const humanagent = new HumanAgent(this.world)
            // this.setAgent(humanagent)
        }

        this.world.create()
        // this.setAgent(humanagent);


    }

    hold_input = (key, isPressed) => {
        if(this.agent)
            this.agent.toggleKey(key, isPressed)
    }

    handleGamepadInput = () => {
        const currentGamepads = navigator?.getGamepads();

        if (!currentGamepads) return;

        for (let i = 0; i < currentGamepads.length; i++) {
            const gamepad = currentGamepads[i];
            if (!gamepad) continue; // 确保手柄存在
            if (gamepad) { // 确保手柄存在
                // 存储或更新手柄信息

                let gamepadActive = false;

                // 处理摇杆输入 (axes)
                gamepad.axes.forEach((axisValue, index) => {
                    // axisValue 通常在 -1.0 到 1.0 之间
                    if (index === 0) {
                        if (Math.abs(axisValue) > 0.5) { // 只在摇杆偏移超过阈值时触发
                            gamepadActive = true;
                            if (axisValue < 0) {
                                this.hold_input('arrowLeft', true); // 向左
                            } else if (axisValue > 0) {
                                this.hold_input('arrowRight', true); // 向右
                            }
                        } else {
                            this.hold_input('arrowLeft', false);
                            this.hold_input('arrowRight', false);
                        }
                    }
                });

                // 处理按钮输入
                gamepad.buttons.forEach((button, index) => {
                    if (button.pressed) {
                        // console.log(`手柄 ${gamepad.id} 按钮 ${index} 被按下`);
                        if (index === 0) {
                            this.hold_input('z', true); // 假设按钮 0 是跳跃
                        } else if (index === 1 || index === 5) {
                            this.hold_input('x', true); // 假设按钮 1 是加速
                        } else if (index === 14) {
                            this.hold_input('arrowLeft', true); // 假设按钮 14 是向左
                        } else if (index === 15) {
                            this.hold_input('arrowRight', true); // 假设按钮 15 是向右
                        }
                    } else {
                        // console.log(`手柄 ${gamepad.id} 按钮 ${index} 被释放`);
                        if (index === 0) {
                            this.hold_input('z', false); // 假设按钮 0 是跳跃
                        } else if (index === 1 || index === 5) {
                            this.hold_input('x', false); // 假设按钮 1 是加速
                        } else if (!gamepadActive) {
                            if (index === 14) {
                                this.hold_input('arrowLeft', false); // 假设按钮 14 是向左
                            } else if (index === 15) {
                                this.hold_input('arrowRight', false); // 假设按钮 15 是向右
                            }
                        }

                    }
                });


            }
        }
    }

    worldUpdate = () => {
        // console.log("world update")
        //TODO: 重写MarioResult
        if (this.world.gameStatus !== GameStatus.RUNNING) {
            // console.log("game end!" + this.world.gameStatus)


            // if (!this.resultPath && !this.replayBreak) {
            //     Replay.saveReplay(this.resultPath, res.getAgentEvents());
            // }
            if (this.onGameEnd) {
                let res = new MarioResult(this.world, this.gameEvents, this.agentEvents);
                res.levelString = this.levelString;
                this.onGameEnd(res);
                this.onGameEnd = null;
            }
        }
        if (!this.pause) {

            this.handleGamepadInput();
            //Update Timer

            this.checkAndLoadNewSegment();

            if (this.world.mario.x / (16 * this.col) > this.segNum) {
                this.segNum++;
                // this.world.setCurrentTimer(1000 * this.timer);
            }

            this.agentTimer = new MarioTimer(MarioGame.maxTime);
            //get actions
            //boolean[] actions = this.agent.getActions(new MarioForwardModel(this.world), this.agentTimer);
            //TODO: MarioForwardModel
            let actions = this.agent.getActions(null, this.agentTimer);
            // if (MarioGame.verbose) {
            //     if (this.agentTimer.getRemainingTime() < 0 && Math.abs(this.agentTimer.getRemainingTime()) > MarioGame.graceTime) {
            //         console.log("The Agent is slowing down the game by: "
            //             + Math.abs(this.agentTimer.getRemainingTime()) + " msec.");
            //     }
            // }
            if (this.timer === 0) {
                this.world.lose();
                this.replayBreak = true;
            }
            // Mid Break & Cheat Mode
            if (actions[0] && !actions[1] && actions[2] && actions[3] && actions[4] && actions[5]) {
                this.world.debug();
                this.cheatBreak = true;
                //break;
            }
            if (!actions[0] && actions[1] && actions[2] && actions[3] && actions[4] && actions[5]) {
                this.world.debug();
                this.replayBreak = true;
                //break;
            }
            if (this.world.deathBuffer > 0) {
                actions = new Array(6).fill(false)
                this.world.deathBuffer--;
            } else {
                this.world.deathBuffer = 0;
            }

            // update world
            this.world.update_(actions, false);
            //System.out.println((int) this.world.mario.y / 16);
            this.gameEvents.push(this.world.lastFrameEvents)
            // this.gameEvents.addAll(this.world.lastFrameEvents);
            this.agentEvents.push(new MarioAgentEvent(actions, this.world.mario.x,
                this.world.mario.y, (this.world.mario.isLarge ? 1 : 0) + (this.world.mario.isFire ? 1 : 0),
                this.world.mario.onGround, this.world.currentTick));
            // console.log(`"${this.agent.p}": {"x": ${this.world.mario.x}, "y": ${this.world.mario.y}}`)
            // if(this.agent.p === 102) this.pause = true;
        }

        if (this.visual) {
            this.render.renderWorld(this.world, null, null, this.render.og);
        }

    }

    gameLoop(level, timer, marioState, visual, fps, resultPath, col) {

        // this.world = new MarioWorld(this.killEvents);
        this.world.visuals = visual;
        // this.world.initializeLevel(level, 1000 * timer);
        // if (visual) {
        //     this.world.initializeVisuals(null);
        // }
        this.world.lives = this.initialLives;
        this.world.mario.isLarge = marioState > 0;
        this.world.mario.isFire = marioState > 1;


        // let currentTime = Date.now();

        this.agentTimer = new MarioTimer(MarioGame.maxTime);
        //TODO: MarioForwardModel
        //this.agent.initialize(new MarioForwardModel(this.world.clone()), agentTimer);
        this.agent.initialize(null, this.agentTimer);

        this.gameEvents = [];
        this.agentEvents = [];
        this.replayBreak = false;
        this.cheatBreak = false;
        this.segNum = 0;
        this.resultPath = resultPath;
        this.col = col;
        this.timer = timer;
        this.visual = visual;

        this.world.setCurrentTimer(timer * 1000);

        this.world.onUpdate = this.worldUpdate.bind(this);
    }

    stopGame() {
        this.world.lose();
    }


    // keyPressed(e) {
    //     toggleKey(e.getKeyCode(), true);
    // }


    // keyReleased(e) {
    //     toggleKey(e.getKeyCode(), false);
    // }

    // toggleKey(keyCode, isPressed) {
    //     if (keyCode == KeyEvent.VK_Q) {
    //         if (isPressed) {
    //             stopGame();
    //             System.out.println("Pressed mg");
    //         }
    //     }
    // }

    setLives(lives) {
        this.initialLives = lives;
    }

    // 检查是否需要加载新的关卡片段
    checkAndLoadNewSegment() {

        // console.log("check and load new segment", this.onRequireNewSegment);

        if (!this.onRequireNewSegment || this.isLoadingSegment) {
            return;
        }

        if (!this.world.mario) {
            return;
        }

        // 计算玩家当前位置相对于关卡的进度
        const playerTileX = Math.floor(this.world.mario.x / 16);
        const remainingTiles = this.world.level.tileWidth - playerTileX;

        

        // 如果玩家接近关卡末尾，触发加载新片段
        if (remainingTiles <= this.triggerDistance) {
            this.requestNewSegment();
        }
    }

    // 请求新的关卡片段
    async requestNewSegment() {
        console.log(`request new segment current online gen count: ${this.currentOnlineGenCount}, max online gen count: ${this.maxOnlineGenCount}`);
        this.isLoadingSegment = true;

        try {

            // 调用回调函数获取新片段
            const newSegment = await this.onRequireNewSegment();

            if (newSegment && typeof newSegment === 'string') {
                // 将新片段添加到关卡中
                this.world.level.appendSegment(newSegment);

                this.levelString = appendLevel(this.levelString , newSegment);

                this.currentOnlineGenCount++;

                if(this.currentOnlineGenCount >= this.maxOnlineGenCount) {
                    console.log(`Reached maximum online generation count: ${this.maxOnlineGenCount}`);
                    this.onRequireNewSegment = null; // 达到最大在线生成次数，停止请求新片段
                }

                // console.log("update level string", this.levelString)
                

                // console.log(`New segment added. Level width: ${this.world.level.tileWidth}`);
            }else if(newSegment === null) {
                console.log(`No new segment returned, stopping further requests.`);
                this.onRequireNewSegment = null; // 达到最大在线生成次数，停止请求新片段
            }
        } catch (error) {
            console.error('Failed to load new segment:', error);
        } finally {
            this.isLoadingSegment = false;
        }
    }

}

