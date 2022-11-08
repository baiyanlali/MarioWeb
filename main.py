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
        # excel = ExcelWork(questionarePath)
        # questionareLine = excel.getMaxRow()+1
        # print(questionareLine)
        # excel.setCell(questionareLine,1,ip)
        # excel.setCell(questionareLine, 2, result.get("gamestyle"))
        # excel.setCell(questionareLine, 3, result.get("frequency"))
        # excel.setCell(questionareLine, 4, result.get("age"))
        # excel.saveFile()
        # print(questionareLine)
        print(result.get("gamestyle"))
        return redirect(url_for('gameplay', id=ip))


@app.route('/again')
def gamepreplayAgain():
    return redirect(url_for('gameplay', id=request.remote_addr))


@app.route('/')
def gamequestion():
    return render_template('GameQuestion.html')


@app.route('/gameplay/<id>')
def gameplay(id):
    gamelevels = idm.getLevels(id)
    return render_template('GamePlay.html', gamelevels=gamelevels)


@app.route('/annotation/<id>')
def gameanno(id):
    print("anno " + id)

    gamelevels = idm.getRecent(id)
    level1 = "lvl" + str(gamelevels[0])
    level2 = "lvl" + str(gamelevels[1])
    return render_template('GameAnnotation.html', level1=level1, level2=level2)


#
@app.route('/gameplay/<id>/data', methods=['POST'])
def getJSONData(id):
    if request.method == 'POST':
        print("POST Game")
        # print(request.form)
        # print(list(request.form))
        resultList = list(request.form)[0].split(",")

        # FIXME: SAVING IN TXT
        saveFile(replayDataPath, id + resultList[0], resultList[1:])
    return "get!"


@app.route('/annotation/radioresult', methods=['POST'])
def getRadioData():
    if request.method == 'POST':
        print("POST Eval")
        result = request.form
        print(result)
        ip = request.remote_addr
        ipRecent = idm.getRecent(ip)
        idm.write_csv(annotationPath, [ip, ipRecent[0], ipRecent[1], result["fun"]])

        # saveFile(evalDataPath,"gameanno",request.json[0]+request.json[1]+request.json[2])
    return render_template("GameOver.html")


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
