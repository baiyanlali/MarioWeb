import json
import os
import struct

from IDManager import idManager

from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__, static_folder='')
idm = idManager()

replayDataPath = "reps/"
evalDataPath = "evals/"

questionarePath = "data/questionare.csv"
annotationPath = "data/annotation.csv"


@app.route('/annotation')
def gamepreanno():
    return redirect(url_for('gameanno', id=request.remote_addr))


@app.route('/result', methods=['POST', 'GET'])
def gamepreplay():
    if request.method == 'POST':
        result = request.form
        ip = request.remote_addr
        # Save the result to questionare
        idm.write_csv(questionarePath,
                      [ip, result.get("gamestyle"), result.get("frequency"), result.get("age"), result.get("gender"),
                       ""])
        idm.setControl(ip, result.get("control"))
        print(result.get("gamestyle"))
        return redirect(url_for('gametutorial', id=ip))


@app.route('/again')
def gamepreplayAgain():
    return redirect(url_for('gameplay', id=request.remote_addr))


@app.route('/')
def gamequestion():
    return render_template('GameQuestion.html')

@app.route('/gametutorial/<id>')
def gametutorial(id):
    return render_template('GameTutorial.html', tutorial=idm.addTutorial(id), next=idm.hasNextTutorial(id))

@app.route('/gametutorial/<id>/data')
def gametutorialdata(id):
    return redirect(url_for('gameplay', id=id))

@app.route('/gameplay/<id>')
def gameplay(id):
    gamelevels = idm.getLevels(id)
    return render_template('GamePlay.html', gamelevels=gamelevels, control = idm.getControl(id))

@app.route('/gameplay/<id>/data', methods=['POST'])
def getJSONData(id):
    if request.method == 'POST':
        print("POST Game")
        resultList = list(request.form)[0].split(",")
        print(resultList)
        saveFile(replayDataPath, id + resultList[0][:-2], resultList[1:])
    return "return!"



@app.route('/annotation/<id>')
def gameanno(id):
    print("anno " + id)

    gamelevels = idm.getRecent(id)
    level1 = "lvl" + str(gamelevels[0])
    level2 = "lvl" + str(gamelevels[1])
    return render_template('GameAnnotation.html', level1=level1, level2=level2)

@app.route('/annotation/radioresult', methods=['POST'])
def getRadioData():
    ip = request.remote_addr

    if request.method == 'POST':
        print("POST Eval")
        result = request.form
        print(result)
        ipRecent = idm.getRecent(ip)
        idm.write_csv(annotationPath, [ip, ipRecent[0], ipRecent[1], result["fun"]])
        idm.addTimes(ip)
        # saveFile(evalDataPath,"gameanno",request.json[0]+request.json[1]+request.json[2])
    finish = idm.getTimes(ip)

    return render_template("GameOver.html",finish = finish)






def saveFile(path, filename, content):
    cp = list(map(int, content))
    file_dir = os.path.join(os.getcwd(), path)
    file_path = os.path.join(file_dir, filename + ".rep")
    with open(file_path, 'wb') as f:
        f.write(b''.join(struct.pack('B', c) for c in cp))


if __name__ == '__main__':
    app.debug = True
    app.run()
    app.run(debug=True)
