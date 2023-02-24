package agents;

import engine.core.MarioAgent;
import engine.core.MarioForwardModel;
import engine.core.MarioTimer;
import engine.helper.GameStatus;

import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

public class ReplayAgent extends KeyAdapter implements MarioAgent {
    private int p;
    private  boolean isPressed;
    private  boolean[][] actions;
    private MarioForwardModel marioForwardModel;

    @Override
    public void initialize(MarioForwardModel model, MarioTimer timer) {
        marioForwardModel = model;
    }

    public ReplayAgent(boolean[][] actions) {
        this.actions = actions;
        isPressed = false;
        this.p = 0;
    }

    public void reset() {
        this.p = 0;
    }

    @Override
    public boolean[] getActions(MarioForwardModel model, MarioTimer timer) {
        if(!isPressed){
            if (p >= actions.length)
                return new boolean[5];
            return this.actions[p++];
        }else{
            System.out.println("return true");
            return new boolean[]{true, true, false, true, true};
        }

    }

    @Override
    public String getAgentName() {
        return "ReplayAgent";
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
                this.isPressed = true;
                System.out.println("Pressed");
            }else{
                this.isPressed = false;
            }


        }
    }

}
