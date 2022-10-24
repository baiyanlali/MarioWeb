from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__, static_folder='')

bufferJson = ['']

@app.route('/')
def index():
    py2htmlstr = 'py2html test str'
    return render_template('play.html', py2htmlstr=py2htmlstr)


@app.route('/datapage')
def datapage():
    return bufferJson


@app.route('/eval')
def eval():
    return render_template('eval.html')


@app.route('/', methods=['POST'])
def getData():
    if request.method == 'POST':
        print("POST")
        print(request.json)
        return redirect(url_for('datapage'))


if __name__ == '__main__':
    app.debug = True
    app.run()
    app.run(debug=True)
