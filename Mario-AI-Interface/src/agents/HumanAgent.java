package agents;

import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

import engine.core.MarioAgent;
import engine.core.MarioForwardModel;
import engine.core.MarioTimer;
import engine.helper.MarioActions;

public class HumanAgent extends KeyAdapter implements MarioAgent {
    private boolean[] actions = null;
    private boolean oldControl = true;
    private boolean isPressed = false;

    public HumanAgent(boolean oldControl){
        this.oldControl = oldControl;
    }
    @Override
    public void initialize(MarioForwardModel model, MarioTimer timer) {
        actions = new boolean[MarioActions.numberOfActions()];
        isPressed = false;
    }

    @Override
    public boolean[] getActions(MarioForwardModel model, MarioTimer timer) {
        if(!isPressed){
            return actions.clone();
        }else{
            System.out.println("return true");
            return new boolean[]{true, false, true, true, true, true};
        }

    }

    @Override
    public String getAgentName() {
        return "HumanAgent";
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
        if (this.actions == null) {
            return;
        }
        if(keyCode==KeyEvent.VK_0){
            if(isPressed){
                this.isPressed = true;
                System.out.println("Pressed");
            }else{
                this.isPressed = false;
            }
        }
        if(oldControl){
            switch (keyCode) {
                case KeyEvent.VK_LEFT:
                    this.actions[MarioActions.LEFT.getValue()] = isPressed;
                    break;
                case KeyEvent.VK_RIGHT:
                    this.actions[MarioActions.RIGHT.getValue()] = isPressed;
                    break;
                case KeyEvent.VK_DOWN:
                    this.actions[MarioActions.DOWN.getValue()] = isPressed;
                    break;
                case KeyEvent.VK_S:
                    this.actions[MarioActions.JUMP.getValue()] = isPressed;
                    break;
                case KeyEvent.VK_A:
                    this.actions[MarioActions.SPEED.getValue()] = isPressed;
                    break;
            }
        }
        else{
            switch (keyCode) {
                case KeyEvent.VK_A:
                    this.actions[MarioActions.LEFT.getValue()] = isPressed;
                    break;
                case KeyEvent.VK_D:
                    this.actions[MarioActions.RIGHT.getValue()] = isPressed;
                    break;
                case KeyEvent.VK_S:
                    this.actions[MarioActions.DOWN.getValue()] = isPressed;
                    break;
                case KeyEvent.VK_J:
                    this.actions[MarioActions.JUMP.getValue()] = isPressed;
                    break;
                case KeyEvent.VK_K:
                    this.actions[MarioActions.SPEED.getValue()] = isPressed;
                    break;
            }
        }

    }

}
