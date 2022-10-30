import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

import agents.HumanAgent;
import agents.ReplayAgent;
import engine.core.MarioAgentEvent;
import engine.core.MarioGame;
import engine.core.MarioResult;
import engine.helper.Replay;

public class Play {
    public static String getLevel(String filepath) {
        String content = "";
        try {
            content = new String(Files.readAllBytes(Paths.get(filepath)));
        } catch (IOException e) {
        }
        return content;
    }

    public static void main(String[] args) throws IOException {
        String groupID = args[0];
        String levelName = args[1];
//        MarioGame game = new MarioGame();
//
////        String levelPath = String.format("/app/levels/group%s/%s.txt", groupID, levelName);		// For web
////        String repPath = String.format("/files/tmp.rep");	                                        // For web
//
//        String levelPath = String.format("./levels/group%s/%s.txt", groupID, levelName);			// For local
//        String repPath = String.format("./reps/%s_sav.rep", levelName);	                            // For local
//        MarioResult tmpResult = game.playGame(Replay.getRepAgentFromFile(repPath),getLevel(levelPath), 200, repPath);

//        MarioGame game2 = new MarioGame();
//        MarioResult r2 = game2.playGame(getLevel(levelPath),200,repPath)

    }

    public static byte[] playGameMain(String groupID, String levelName){

        String levelPath = String.format("/app/levels/%s.lvl", levelName);			// For web
        String repPath = String.format("/files/%s_sav.rep", levelName);                            // For web

        MarioGame game = new MarioGame();
        MarioResult tmpResult = game.playGame(new HumanAgent(),getLevel(levelPath), 200, repPath);

        return Replay.serializeAgentEvents(tmpResult.getAgentEvents());
    }

    public static void replayGameMain(String groupID, String levelName){
        String levelPath = String.format("/app/levels/%s.lvl", levelName);		    // For web
        String repPath = String.format("/files/%s_sav.rep", levelName);	                                    // For web

//        String levelPath = String.format("/app/levels/group%s/%s.txt", groupID, levelName);			// For local
//        String repPath = String.format("./files/%s_sav.rep", levelName);	                        // For local

        MarioGame game = new MarioGame();
        game.playGame(Replay.getRepAgentFromFile(repPath),getLevel(levelPath), 200, repPath);
    }
}
