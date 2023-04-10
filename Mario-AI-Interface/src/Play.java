import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

import agents.HumanAgent;
import agents.ReplayAgent;
import com.alibaba.fastjson.JSON;
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

        //FIXME: Debug Use
        //game = new MarioGame();
        //System.out.println(playJavaGame());
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

    public static String playJavaGame(){

        game.setLives(3);
        String levelPath = "./levels/group0/lvl1.lvl";			// For local
        String repPath = "./reps/f_l_sav.rep";	                // For local
        //MarioGame.verbose = true;
        //Play Game
        MarioResult tmpResult = game.playGame(new HumanAgent(false),getLevel(levelPath), 10, repPath,30);
        //Replay
        //MarioResult tmpResult = game.playGame(Replay.getRepAgentFromFile(repPath),getLevel(levelPath), 30, repPath,30);
        //return Replay.serializeAgentEvents(tmpResult.getAgentEvents());
        String jsonString = Replay.serializeGameResult(tmpResult);


        return jsonString;//Replay.serializeAgentEvents(tmpResult.getAgentEvents());
    }

    public static MarioResult playGameMain(String levelName, int lives, boolean control,int time,int col){

        String levelPath = String.format("/app/levels/%s.lvl", levelName);			                // For web
        String repPath = String.format("/files/%s_sav.rep", levelName);                            // For web

//        String levelPath = String.format("./levels/group%s/%s.lvl", "0", levelName);			// For local
//        String repPath = String.format("./reps/%s_sav.rep", levelName);	                        // For local
        game.setLives(lives);
        MarioResult tmpResult = game.playGame(new HumanAgent(control),getLevel(levelPath), time, repPath,col);

        //return Replay.serializeAgentEvents(tmpResult.getAgentEvents());
        //return Replay.serializeGameResult(tmpResult);
        return tmpResult;
    }

    public static MarioResult playGameMain(String levelName){
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

    public static byte[] serializeActionFromJson(String jsonString){
        MarioResult marioResult= JSON.parseObject(jsonString,MarioResult.class);
        ArrayList<MarioAgentEvent> events = marioResult.getAgentEvents();
        byte[] content = new byte[events.size()];
        for (int i = 0; i < events.size(); i++) {
            boolean[] action = events.get(i).getActions();
            content[i] = Replay.serializeAction(action);
        }
        return content;
    }
}
