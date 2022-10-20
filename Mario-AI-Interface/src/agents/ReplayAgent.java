package agents;

import engine.core.MarioAgent;
import engine.core.MarioForwardModel;
import engine.core.MarioTimer;

public class ReplayAgent implements MarioAgent {
    private int p;
    private final boolean[][] actions;

    @Override
    public void initialize(MarioForwardModel model, MarioTimer timer) {
    }

    public ReplayAgent(boolean[][] actions) {
        this.actions = actions;
        this.p = 0;
    }

    public void reset() {
        this.p = 0;
    }

    @Override
    public boolean[] getActions(MarioForwardModel model, MarioTimer timer) {
        if (p >= actions.length)
            return new boolean[5];
        return this.actions[p++];
    }

    @Override
    public String getAgentName() {
        return "ReplayAgent";
    }
}
