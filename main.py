from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__,static_folder='')

@app.route('/')
def index():
    py2htmlstr = 'py2html test str'
    return render_template('play.html',py2htmlstr = py2htmlstr)

@app.route('/dataPage')
def dataPage(data):
   return data

@app.route('/',methods = ['POST'])
def getData():
   if request.method == 'POST':
      print("POST")
      print(request.json)
      return redirect(url_for('dataPage',data = request.json))

if __name__ == '__main__':
    app.run(debug=True)