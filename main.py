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
annotationPath2 = "data/annotation2.csv"


@app.route('/')
def gamewelcome():
    # return redirect(url_for('gameplay', id=request.remote_addr))
    return render_template('GameWelcome.html')


@app.route('/question')
def gamequestion():
    return render_template('GameQuestion.html')


@app.route('/result', methods=['POST', 'GET'])
def gamepreplay():
    if request.method == 'POST':
        result = request.form
        ip = request.remote_addr
        cid = idm.iniId(ip)
        # Save the result to questionare
        idm.write_csv(questionarePath,
                      [cid,
                       result.get("playeds"),
                       result.get("playedp"),
                       result.get("gamestyle"),
                       result.get("frequency"),
                       result.get("age"),
                       result.get("gender"),
                       ""])
        idm.setControl(cid, result.get("control"))
        print(result.get("gamestyle"))
        return redirect(url_for('gametutorial', id=cid))
        # debug use:
        # return redirect(url_for('gameanno2', id=cid))


@app.route('/gametutorial/<id>')
def gametutorial(id):
    return render_template('GameTutorial.html', tutorial=idm.addTutorial(id), next=idm.hasNextTutorial(id),maxT=idm.tutorialMax,
                           control=idm.getControl(id))


@app.route('/again')
def gamepreplayAgain():
    return redirect(url_for('gameplay', id=idm.getId(request.remote_addr)))


@app.route('/gametutorial/<id>/data')
def gametutorialdata(id):
    return redirect(url_for('gameplay', id=id))


@app.route('/gameplay/<id>')
def gameplay(id):
    gamelevels = idm.getLevels(id)
    return render_template('GamePlay.html', gamelevels=gamelevels, control=idm.getControl(id), levelNum=2,
                           jump="/annotation")


@app.route('/gameplay/<id>/data', methods=['POST'])
def getJSONData(id):
    if request.method == 'POST':
        print("POST Game")
        resultList = list(request.form)[0].split(",")
        saveFile(replayDataPath, id + resultList[0][:-2], resultList[1:])
    return "return!"


@app.route('/annotation')
def gamepreanno():
    return redirect(url_for('gameanno', id=idm.getId(request.remote_addr)))


@app.route('/annotation/<id>')
def gameanno(id):
    if (id != "radioresult"):
        print("anno " + id)
        gamelevels = idm.getRecent(id)

        level1 = "lvl" + str(gamelevels[0])
        level2 = "lvl" + str(gamelevels[1])
        return render_template('GameAnnotation.html', level1=level1, level2=level2)


@app.route('/annotation/radioresult', methods=['POST'])
def getRadioData():
    ip = idm.getId(request.remote_addr)

    if request.method == 'POST':
        print("POST Eval")
        result = request.form
        ipRecent = idm.getRecent(ip)
        idm.write_csv(annotationPath, [ip, ipRecent[0], ipRecent[1], result["fun"]])

    if idm.getTimes(ip):
        return redirect(url_for("gameplay2", id=ip))
    else:
        idm.addTimes(ip)
        return redirect(url_for("gameplay", id=ip))


@app.route('/gameplay2')
def gamepreplay2():
    return redirect(url_for('gameplay2', id=idm.getId(request.remote_addr)))


@app.route('/gameplay2/<id>')
def gameplay2(id):
    gamelevels = idm.getTypeLevels(id)
    return render_template('GamePlay.html', gamelevels=gamelevels, control=idm.getControl(id), levelNum=3,
                           jump="/annotation2")


@app.route('/gameplay2/<id>/data', methods=['POST'])
def getJSONData2(id):
    if request.method == 'POST':
        print("POST Game")
        resultList = list(request.form)[0].split(",")
        saveFile(replayDataPath, id + resultList[0][:-2], resultList[1:])
    return "return!"


@app.route('/annotation2')
def gamepreanno2():
    return redirect(url_for('gameanno2', id=idm.getId(request.remote_addr)))


@app.route('/annotation2/<id>')
def gameanno2(id):
    if id != "result":
        print("anno " + id)
        gamelevels = idm.getRecent(id)
        # gamelevels = idm.getTypeLevels(id)
        level1 = gamelevels[0]
        level2 = gamelevels[1]
        level3 = gamelevels[2]
        return render_template('GameAnnotation2.html', level1=level1, level2=level2, level3=level3)
    else:
        print(id)


@app.route('/annotation2/<id>/result', methods=['POST'])
def gameannoresult2(id):
    if request.method == 'POST':
        print("result: " + id)

        resultList = list(request.form)[0].split(",")
        levelList = idm.getRecent(idm.getId(request.remote_addr))


        idm.write_csv(annotationPath2,
                      [idm.getId(request.remote_addr), resultList[0], resultList[1], resultList[2], levelList[0], levelList[1],
                       levelList[2],
                       ""])

        if idm.getTimes(id):
            return redirect(url_for("over", id=id))
        else:
            idm.addTimes(id)
            return redirect(url_for("gameplay2", id=id))


@app.route("/gameover")
def over():
    finish = idm.getTimes(idm.getId(request.remote_addr))

    return render_template("GameOver.html", finish=1, stage=1)


def saveFile(path, filename, content):
    cp = list(map(int, content))
    file_dir = os.path.join(os.getcwd(), path)
    file_path = os.path.join(file_dir, filename + ".rep")
    with open(file_path, 'wb') as f:
        f.write(b''.join(struct.pack('B', c) for c in cp))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=False)
    # app.run()
