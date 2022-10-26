import os

from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__, static_folder='')

replayDataPath = "reps/"
evalDataPath = "evals/"

@app.route('/')
def index():
    py2htmlstr = 'py2html test str'
    return render_template('play.html', py2htmlstr=py2htmlstr)


@app.route('/eval')
def eval():
    return render_template('eval.html')


@app.route('/', methods=['POST'])
def getJSONData():
    if request.method == 'POST':
        print("POST Game")
        print(request.json)
        saveFile(replayDataPath, request.json[4], request.json)
    return "Catch JSON Data"

@app.route('/eval', methods=['POST'])
def getRadioData():
    if request.method == 'POST':
        print("POST Eval")
        print(request.json)
        saveFile(evalDataPath,"eval",request.json[0]+request.json[1]+request.json[2])
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
