import os
import json

from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__, static_folder='')

replayDataPath = "reps/"
evalDataPath = "evals/"

@app.route('/gameplay')
def gameplay():
    return render_template('GamePlay.html')


@app.route('/gameanno')
def gameanno():
    return render_template('GameAnnotation.html')


@app.route('/gameplay', methods=['POST'])
def getJSONData():
    if request.method == 'POST':
        print("POST Game")
        print(request.json)
        saveFile(replayDataPath, request.json[4], request.json)
    return "Catch JSON Data"

@app.route('/gameanno', methods=['POST'])
def getRadioData():
    if request.method == 'POST':
        print("POST Eval")
        print(request.values)

        #saveFile(evalDataPath,"gameanno",request.json[0]+request.json[1]+request.json[2])
    return "catch Radio"

def saveFile(path,filename,content):
    file_dir = os.path.join(os.getcwd(), path)
    file_path = os.path.join(file_dir, filename+".txt")
    f = open(file_path, "w", encoding="utf8")
    f.write(content)
    f.close()

if __name__ == '__main__':
    app.debug = True
    app.run()
    app.run(debug=True)
