function closeReplayWindow(){
    var replayWindow=document.getElementById("replayWindow");
    replayWindow.style.visibility = 'hidden';	
}

function getValue(){
    var radio = document.getElementsByName("gameRadio");
    for (i=0; i<radio.length; i++) {
        if (radio[i].checked) {
            alert(radio[i].value)
        }
    }
}

function PostToServer(url,data) {
    if(url == null){
        $.post(window.location.href, data);
    }else{
        $.post(url, data);
    }
}
function GameLoad(){
    return cjCall("Play","initialGame");
}
function PlayLevel(level,control){
    console.log("HTML:Start PlayLevel cjCall")
    var returnVal = cjCall("Play", "playGameMain", level, 5, control,30,16);
    return returnVal.then(function(){ 
      console.log("the return val is ready");  
      console.log(returnVal.value);
      PostToServer(window.location.href+"/data",level+returnVal.value);    
      //Array.from()
    });
  }

  function GameOver(){
    if(alert("Game Over!")){

    }
  }
  function getRadioValue(){
    alert("getvalue");
    var obj = document.getElementsByName("fun");
    var result = " ";
    for(var i=0; i<obj.length; i ++){
        if(obj[i].checked){
            PostToServer(obj[i].value);
            result = obj[i].value;
            alert(obj[i].value);
        }
    }
    
    }

    function getLevels(gameLevelstr,num){
        console.log(gameLevelstr)
        var levels = gameLevelstr.split(",")
        var result = []
        for (i = 0; i < num; i++) {
            result[i] = cleanStr(levels[i])
         }

        return result;
    }

    function cleanStr(str){
        str=str.replace("&#39;","")
        str=str.replace("&#39;","")
        str=str.replace("[","")
        str=str.replace("]","")
        str=str.replace(" ","")
        str=str.replace(" ","")
        return str;
    }