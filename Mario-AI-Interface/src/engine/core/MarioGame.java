package engine.core;

import java.awt.event.KeyEvent;
import java.util.ArrayList;
import java.awt.*;
import java.awt.event.KeyAdapter;

import javax.swing.JFrame;

import agents.HumanAgent;
import engine.helper.GameStatus;
import engine.helper.MarioActions;
import engine.helper.Replay;

public class MarioGame extends KeyAdapter{
    /**
     * the maximum time that agent takes for each step
     */
    public static final long maxTime = 40;
    /**
     * extra time before reporting that the agent is taking more time that it should
     */
    public static final long graceTime = 10;
    /**
     * Screen width
     */
    public static final int width = 256;
    /**
     * Screen height
     */
    public static final int height = 256;
    /**
     * Screen width in tiles
     */
    public static final int tileWidth = width / 16;
    /**
     * Screen height in tiles
     */
    public static final int tileHeight = height / 16;
    /**
     * print debug details
     */
    public static final boolean verbose = false;

    /**
     * pauses the whole game at any moment
     */
    public boolean pause = false;

    /**
     * events that kills the player when it happens only care about type and param
     */
    private MarioEvent[] killEvents;

    //visualization
    private JFrame window = null;
    private MarioRender render = null;
    private MarioAgent agent = null;
    private MarioWorld world = null;
    private int initialLives;

    /**
     * Create a mario game to be played
     */
    public MarioGame() {

    }

    /**
     * Create a mario game with a different forward model where the player on certain event
     *
     * @param killEvents events that will kill the player
     */
    public MarioGame(MarioEvent[] killEvents) {
        this.killEvents = killEvents;
    }

    private int getDelay(int fps) {
        if (fps <= 0) {
            return 0;
        }
        return 1000 / fps;
    }

    private void setAgent(MarioAgent agent) {
        this.agent = agent;
        if (agent instanceof KeyAdapter) {
            this.render.addKeyListener((KeyAdapter) this.agent);
        }
    }
    public MarioResult playGame(String level, String resultPath,int col) {
        return this.runGame(new agents.HumanAgent(true), level, 200, 0, true, 30, 2, resultPath,col);
    }

    /**
     * Play a certain mario level
     *
     * @param level a string that constitutes the mario level, it uses the same representation as the VGLC but with more details. for more details about each symbol check the json file in the levels folder.
     * @param timer number of ticks for that level to be played. Setting timer to anything &lt;=0 will make the time infinite
     * @return statistics about the current game
     */
    public MarioResult playGame(MarioAgent gameAgent,String level, int timer, String resultPath,int col) {
        return this.runGame(gameAgent, level, timer, 0, true, 30, 2, resultPath,col);
    }

    /**
     * Run a certain mario level with a certain agent
     *
     * @param agent the current AI agent used to play the game
     * @param level a string that constitutes the mario level, it uses the same representation as the VGLC but with more details. for more details about each symbol check the json file in the levels folder.
     * @param timer number of ticks for that level to be played. Setting timer to anything &lt;=0 will make the time infinite
     * @return statistics about the current game
     */
    public MarioResult runGame(MarioAgent agent, String level, int timer,int col) {
        return this.runGame(agent, level, timer, 0, true, 0, 2, "",col);
    }

    /**
     * Run a certain mario level with a certain agent
     *
     * @param agent      the current AI agent used to play the game
     * @param level      a string that constitutes the mario level, it uses the same representation as the VGLC but with more details. for more details about each symbol check the json file in the levels folder.
     * @param timer      number of ticks for that level to be played. Setting timer to anything &lt;=0 will make the time infinite
     * @param marioState the initial state that mario appears in. 0 small mario, 1 large mario, and 2 fire mario.
     * @param visuals    show the game visuals if it is true and false otherwise
     * @param fps        the number of frames per second that the update function is following
     * @param scale      the screen scale, that scale value is multiplied by the actual width and height
     * @return statistics about the current game
     */
    public MarioResult runGame(MarioAgent agent, String level, int timer, int marioState, boolean visuals, int fps, float scale, String resultPath, int col) {
        if (visuals) {
            this.window = new JFrame("Mario AI Framework");
            this.render = new MarioRender(scale);
            this.window.setContentPane(this.render);
            this.window.pack();
            this.window.setResizable(false);
            this.window.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            this.render.init();
            this.window.setVisible(true);
        }
        this.setAgent(agent);
        return this.gameLoop(level, timer, marioState, visuals, fps, resultPath, col);
    }

    private MarioResult gameLoop(String level, int timer, int marioState, boolean visual, int fps, String resultPath, int col) {
        this.world = new MarioWorld(this.killEvents);
        this.world.visuals = visual;
        this.world.initializeLevel(level, 1000 * timer);
        if (visual) {
            this.world.initializeVisuals(this.render.getGraphicsConfiguration());
        }
        this.world.lives = this.initialLives;
        this.world.mario.isLarge = marioState > 0;
        this.world.mario.isFire = marioState > 1;
        this.world.update(new boolean[MarioActions.numberOfActions()]);
        long currentTime = System.currentTimeMillis();

        //initialize graphics
        Image renderTarget = null;
        Graphics backBuffer = null;
        Graphics currentBuffer = null;
        if (visual) {
            renderTarget = this.render.createImage(MarioGame.width, MarioGame.height);
            backBuffer = this.render.getGraphics();
            currentBuffer = renderTarget.getGraphics();
            this.render.addFocusListener(this.render);
        }

        MarioTimer agentTimer = new MarioTimer(MarioGame.maxTime);
        //TODO: MarioForwardModel
        //this.agent.initialize(new MarioForwardModel(this.world.clone()), agentTimer);
        this.agent.initialize(null,agentTimer);

        ArrayList<MarioEvent> gameEvents = new ArrayList<>();
        ArrayList<MarioAgentEvent> agentEvents = new ArrayList<>();
        boolean replayBreak = false;
        boolean cheatBreak = false;
        int segNum = 0;
        while (this.world.gameStatus == GameStatus.RUNNING) {
            if (!this.pause) {
                //Update Timer

                if(world.mario.x / (16*col) > segNum){
                    segNum++;
                    this.world.setCurrentTimer(1000 * timer);
                }

                agentTimer = new MarioTimer(MarioGame.maxTime);
                //get actions
                //boolean[] actions = this.agent.getActions(new MarioForwardModel(this.world), agentTimer);
                //TODO: MarioForwardModel
                boolean[] actions = this.agent.getActions(null, agentTimer);
                if (MarioGame.verbose) {
                    if (agentTimer.getRemainingTime() < 0 && Math.abs(agentTimer.getRemainingTime()) > MarioGame.graceTime) {
                        System.out.println("The Agent is slowing down the game by: "
                                + Math.abs(agentTimer.getRemainingTime()) + " msec.");
                    }
                }
                if(timer==0){
                    this.world.lose();
                    replayBreak = true;
                }
                // Mid Break & Cheat Mode
                if(actions[0]&&!actions[1]&&actions[2]&&actions[3]&&actions[4]&&actions[5]){
                    this.world.lose();
                    cheatBreak = true;
                    //break;
                }
                if(!actions[0]&&actions[1]&&actions[2]&&actions[3]&&actions[4]&&actions[5]){
                    this.world.lose();
                     replayBreak = true;
                    //break;
                }
                if(world.deathBuffer >0){
                    actions = new boolean[6];
                    world.deathBuffer -= 30;
                }else{
                    world.deathBuffer = 0;
                }

                // update world
                this.world.update(actions);
                gameEvents.addAll(this.world.lastFrameEvents);
                agentEvents.add(new MarioAgentEvent(actions, this.world.mario.x,
                        this.world.mario.y, (this.world.mario.isLarge ? 1 : 0) + (this.world.mario.isFire ? 1 : 0),
                        this.world.mario.onGround, this.world.currentTick));
            }

            //render world
            if (visual) {
                this.render.renderWorld(this.world, renderTarget, backBuffer, currentBuffer);
            }
            //check if delay needed
            if (this.getDelay(fps) > 0) {
                try {
                    currentTime += this.getDelay(fps);
                    Thread.sleep(Math.max(0, currentTime - System.currentTimeMillis()));
                } catch (InterruptedException e) {
                    break;
                }
            }
        }
        //Pause 1 second before return
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {}

        MarioResult res = new MarioResult(this.world, gameEvents, agentEvents);
        if (!resultPath.isEmpty()&&!replayBreak) {
            Replay.saveReplay(resultPath, res.getAgentEvents());
        }
        return new MarioResult(this.world, gameEvents, agentEvents);
    }

    public void stopGame(){
        this.world.lose();
    }

    @Override
    public void keyPressed(KeyEvent e) {
        toggleKey(e.getKeyCode(), true);
    }

    @Override
    public void keyReleased(KeyEvent e) {
        toggleKey(e.getKeyCode(), false);
    }

    private void toggleKey(int keyCode, boolean isPressed) {
        if(keyCode == KeyEvent.VK_Q){
            if(isPressed){
                stopGame();
                System.out.println("Pressed mg");
            }
        }
    }
    public void setLives(int lives) {
        this.initialLives = lives;
    }


}

