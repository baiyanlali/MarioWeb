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
    private static MarioGame game;
    public static String getLevel(String filepath) {
        String content = "";
        try {
            content = new String(Files.readAllBytes(Paths.get(filepath)));
        } catch (IOException e) {
        }
        return content;
    }

    public static void main(String[] args) throws IOException {

        //MarioGame game = new MarioGame();

//        String levelPath = String.format("/app/levels/group%s/%s.txt", groupID, levelName);		// For web
//        String repPath = String.format("/files/tmp.rep");	                                        // For web
/*        game.setLives(10);
        String levelPath = "./levels/group0/f_l.txt";			// For local
        String repPath = "./reps/f_l_sav.rep";	 */                           // For local
//        MarioResult r2 = game.playGame(getLevel(levelPath), repPath);
        //game.playGame(Replay.getRepAgentFromFile(repPath),getLevel(levelPath), 30, repPath,20);

//        MarioGame game2 = new MarioGame();
        //FIXME: Debug Use
        //playGameMain("lvl1");

        System.out.println("Java: Play Java Main Function Done");
    }
    public static boolean initialGame(){
        game = new MarioGame();
        String levelName = "t1";
        String levelPath = String.format("/app/levels/%s.lvl", levelName);			                // For web
        String repPath = String.format("/files/%s_sav.rep", levelName);                            // For web
        game.playGame(new HumanAgent(true),getLevel(levelPath),0,repPath,10);
        return true;
    }

    public static byte[] playGameMain(String levelName, int lives, boolean control,int time,int col){

        String levelPath = String.format("/app/levels/%s.lvl", levelName);			                // For web
        String repPath = String.format("/files/%s_sav.rep", levelName);                            // For web

//        String levelPath = String.format("./levels/group%s/%s.lvl", "0", levelName);			// For local
//        String repPath = String.format("./reps/%s_sav.rep", levelName);	                        // For local
        game.setLives(lives);
        MarioResult tmpResult = game.playGame(new HumanAgent(control),getLevel(levelPath), time, repPath,col);

        return Replay.serializeAgentEvents(tmpResult.getAgentEvents());
    }

    public static byte[] playGameMain(String levelName){
        return playGameMain(levelName, 5, false,30,16);
    }

    public static MarioResult replayGameMain(String levelName, int lives, int time, int col){
        String levelPath = String.format("/app/levels/%s.lvl", levelName);		    // For web
        String repPath = String.format("/files/%s_sav.rep", levelName);	                                    // For web

//        String levelPath = String.format("/app/levels/group%s/%s.txt", groupID, levelName);			// For local
//        String repPath = String.format("./files/%s_sav.rep", levelName);	                        // For local
        
        game.setLives(lives);
        return game.playGame(Replay.getRepAgentFromFile(repPath),getLevel(levelPath), time, repPath,col);
    }
    public static void stopReplay(){
        game.stopGame();
    }
}
