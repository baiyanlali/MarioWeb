import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

import engine.core.MarioAgentEvent;
import engine.core.MarioGame;
import engine.core.MarioResult;

public class Play {
    public static String getLevel(String filepath) {
        String content = "";
        try {
            content = new String(Files.readAllBytes(Paths.get(filepath)));
        } catch (IOException e) {
        }
        return content;
    }
    public static byte[] serializeAgentEvents(ArrayList<MarioAgentEvent> events) {
        byte[] content = new byte[events.size()];
        for (int i = 0; i < events.size(); i++) {
            boolean[] action = events.get(i).getActions();
//            System.out.println(action);
            content[i] = serializeAction(action);
        }
        return content;
    }
    public static byte serializeAction(boolean[] action) {
        byte res = 0;
        for (int i = 0; i < 5; i++) {
            if (action[i])
                res += 1 << i;
        }
        return res;
    }

    public static void main(String[] args) throws IOException {
        String groupID = args[0];
        String levelName = args[1];
        String participantID = args[2];
        //MarioGame game = new MarioGame();

        String levelPath = String.format("/app/levels/group%s/%s.txt", groupID, levelName);			// For web
        //String repPath = String.format("/files/reps/participant%s/%s.rep", participantID, levelName);	// For web
        String repPath = String.format("/files/1.rep");	// For web
//String levelPath = String.format("./levels/group%s/%s.txt", groupID, levelName);			// For web
//String repPath = String.format("./reps/participant%s/%s.rep", participantID, levelName);	// For web
        //MarioResult tmpResult = game.playGame(getLevel(levelPath), 200, repPath);
        //return serializeAgentEvents(tmpResult.getAgentEvents());

    }
    public static byte[] otherMain(String groupID, String levelName, String participantID){
        MarioGame game = new MarioGame();

        String levelPath = String.format("/app/levels/group%s/%s.txt", groupID, levelName);			// For web
        //String repPath = String.format("/files/reps/participant%s/%s.rep", participantID, levelName);	// For web
        String repPath = String.format("/files/1.rep");	// For web
        MarioResult tmpResult = game.playGame(getLevel(levelPath), 200, repPath);
        return serializeAgentEvents(tmpResult.getAgentEvents());
    }
}
