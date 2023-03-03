package engine.helper;

import agents.ReplayAgent;
import engine.core.MarioAgentEvent;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

public class Replay {

    public static ReplayAgent getRepAgentFromFile(String filepath){
        byte[] content = new byte[0];
        try {
            content = Files.readAllBytes(Paths.get(filepath));
        } catch (IOException e) {
            e.printStackTrace();
        }
        boolean[][] actions = new boolean[content.length][5];
        for (int i = 0; i < actions.length; i++) {
            actions[i] = parseAction(content[i]);
        }
        return new ReplayAgent(actions);
    }

    public static byte[] serializeAgentEvents(ArrayList<MarioAgentEvent> events) {
        byte[] content = new byte[events.size()];
        for (int i = 0; i < events.size(); i++) {
            boolean[] action = events.get(i).getActions();
            content[i] = serializeAction(action);
        }
        return content;
    }

    public static void saveReplay(String filepath, ArrayList<MarioAgentEvent> events) {
        try {
            byte[] content = serializeAgentEvents(events);
            Files.write(Paths.get(filepath), content);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static byte serializeAction(boolean[] action) {
        byte res = 0;
        for (int i = 0; i < 5; i++) {
            if (action[i])
                res += 1 << i;
        }
        return res;
    }

    public static boolean[] parseAction(byte byteAction) {
        boolean[] action = new boolean[5];
        for (int i = 0; i < 5; i++) {
            if ((byteAction & (1 << i)) != 0) {
                action[i] = true;
            }
        }
        return action;
    }
}
