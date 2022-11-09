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
// function PostToServer(data) {
//     var httpRequest = new XMLHttpRequest();//第一步：建立所需的对象
//     httpRequest.open("POST","");  //调用AddDataToServer
//     httpRequest.setRequestHeader("Content-Type", "application/json");   //设置请求头信息
//     httpRequest.onreadystatechange = function () {
//         if (httpRequest.readyState == 4 && httpRequest.status == 200) {
//         //alert('添加成功');
//         }
//     }
//     httpRequest.send(JSON.stringify(data)); //设置为发送给服务器数据
// }
function PostToServer(url,data) {
    if(url == null){
        $.post(window.location.href, data);
    }else{
        $.post(url, data);
    }
}
function PlayLevel(level,control){
    var returnVal = cjCall("Play", "playGameMain", level, 5, control);
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
    // var radio = document.getElementsByName("gameRadio");
    // var addressID = $("input[name='sex']:checked").val();
    // alert(addressID)
    
    }

    function getLevels(gameLevelstr){
        console.log(gameLevelstr)
        var levels = gameLevelstr.split(",")
        var level1 = levels[0];
        var level2 = levels[1];
        level1=cleanStr(level1)
        level2=cleanStr(level2)
            
        console.log(level1);
        console.log(level2);
        return [level1,level2];
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