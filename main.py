import os

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
        idm.write_csv(questionarePath, [ip, result.get("gamestyle"), result.get("frequency"), result.get("age")])
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

    gamelevels = idm.getLevels(id)
    level1 = gamelevels[0]
    level2 = gamelevels[1]
    return render_template('GameAnnotation.html', level1=level1, level2=level2)


#
@app.route('/gameplay/<id>/data', methods=['POST'])
def getJSONData(id):
    if request.method == 'POST':
        print("POST Game")
        print(request.values)
        #FIXME: NOT SAVING!
        saveFile(replayDataPath, request.json[4], request.json)
    return "Catch JSON Data"


@app.route('/annotation/<id>/data', methods=['POST'])
def getRadioData(id):
    if request.method == 'POST':
        print("POST Eval")
        print(request.values)
        result = request.form
        ip = request.remote_addr
        idm.write_csv(annotationPath,[ip,"a","b","anno"])

        # saveFile(evalDataPath,"gameanno",request.json[0]+request.json[1]+request.json[2])
    return "catch Radio"


def saveFile(path, filename, content):
    file_dir = os.path.join(os.getcwd(), path)
    file_path = os.path.join(file_dir, filename + ".txt")
    f = open(file_path, "w", encoding="utf8")
    f.write(content)
    f.close()


if __name__ == '__main__':
    app.debug = True
    app.run()
    app.run(debug=True)
