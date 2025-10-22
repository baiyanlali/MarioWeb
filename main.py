# -*- coding: utf-8 -*-
import json
import os
import struct
import uuid
from datetime import datetime
from werkzeug.middleware.proxy_fix import ProxyFix

from IDManager import idManager

from flask import Flask, render_template, request, redirect, url_for, session
import logging

# 设置logging模块
logging.basicConfig(filename='log.txt', level=logging.DEBUG)
# 将print输出重定向到logging模块
print = logging.getLogger().info

# app = Flask(__name__, static_folder='')
app = Flask(__name__)

app.wsgi_app = ProxyFix(
    app.wsgi_app, 
    x_for=1,       # 转发 X-Forwarded-For
    x_host=1,      # 转发 Host
    x_proto=1,     # 转发 Scheme (http/https)
    x_prefix=1     # 转发 X-Forwarded-Prefix (Caddy 会自动添加)
)

# os.environ['SCRIPT_NAME'] = '/funmario'

idm = idManager()
app.secret_key = 'asdfasdfawefaewvaf'
replayDataPath = "reps/"
jsonDataPath = "jsons/"
evalDataPath = "evals/"

questionarePath = "data/questionare.csv"
annotationPath = "data/annotation.csv"
annotationPath2 = "data/annotation2.csv"
feedbackPath = "data/feedback.csv"


# id=idm.getId(request.remote_addr)
def getId():
    if 'name' not in session:
        session['name'] = str(uuid.uuid4())
    return session['name']


@app.route('/')
def gamewelcome():
    ip = getId()
    # return redirect(url_for('gameplay', id=request.remote_addr))
    # return render_template('Maintenance.html')
    return render_template('GameWelcome.html')


@app.route('/question')
def gamequestion():
    return render_template('GameQuestion.html')


@app.route('/privacy')
def privacypage():
    return render_template('Privacy.html')


@app.route('/result', methods=['POST', 'GET'])
def gamepreplay():
    if request.method == 'POST':
        result = request.form
        # ip = request.remote_addr
        ip = getId()
        cid = idm.iniId(ip)
        # Save the result to questionare
        idm.write_csv(questionarePath,
                      [cid,
                       result.get("playeds"),
                       result.get("playedp"),
                       result.get("gamestyle"),
                       result.get("frequency"),
                       result.get("age") + result.get("myAge"),
                       result.get("gender") + result.get("myGender"),
                       datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")])
        idm.setControl(cid, result.get("control"))
        print(result.get("gamestyle"))
        return redirect(url_for('gametutorial', id=cid))
        # debug use:
        # return redirect(url_for('gameanno2', id=cid))


@app.route('/gametutorial/<id>')
def gametutorial(id):
    return render_template('GameTutorial.html', tutorial=idm.addTutorial(id), next=idm.hasNextTutorial(id),
                           maxT=idm.tutorialMax,
                           control=idm.getControl(id))


@app.route('/again')
def gamepreplayAgain():
    return redirect(url_for('gameplay', id=getId()))


@app.route('/gametutorial/<id>/data')
def gametutorialdata(id):
    return redirect(url_for('gameplay', id=id))


@app.route('/gameplay/<id>')
def gameplay(id):
    gamelevels = idm.getLevels(id)
    return render_template('GamePlay.html', gamelevels=gamelevels, control=idm.getControl(id), levelNum=2,
                           times=idm.getTimes(id),
                           jump="/annotation")


@app.route('/gameplay/<id>/data', methods=['POST'])
def getJSONData(id):
    if request.method == 'POST':
        print("POST Game")
        resultList = list(request.form)[0].split("@@@")
        saveJsonFile(jsonDataPath, id + "_" + resultList[0], resultList[1])
        saveRepFile(replayDataPath, id + "_" + resultList[0], resultList[1])
    return "return!"


@app.route('/annotation')
def gamepreanno():
    return redirect(url_for('gameanno', id=getId()))


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
    ip = getId()

    if request.method == 'POST':
        print("POST Eval")
        result = request.form
        ipRecent = idm.getRecent(ip)
        idm.write_csv(annotationPath, [ip, ipRecent[0], ipRecent[1], result["fun"],
                       datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")])

    if idm.getTimes(ip):
        return redirect(url_for("gameplay2", id=ip))
    else:
        idm.addTimes(ip)
        return redirect(url_for("gameplay", id=ip))


@app.route('/gameplay2')
def gamepreplay2():
    return redirect(url_for('gameplay2', id=getId()))


@app.route('/gameplay2/<id>')
def gameplay2(id):
    gamelevels = idm.getTypeLevels(id)
    return render_template('GamePlay.html', gamelevels=gamelevels, control=idm.getControl(id), levelNum=3,
                           jump="/annotation2")


@app.route('/gameplay2/<id>/data', methods=['POST'])
def getJSONData2(id):
    if request.method == 'POST':
        print("POST Game")
        resultList = list(request.form)[0].split("@@@")
        saveJsonFile(jsonDataPath, id + "_" + resultList[0], resultList[1])
        saveRepFile(replayDataPath, id + "_" + resultList[0], resultList[1])
    return "return!"


@app.route('/annotation2')
def gamepreanno2():
    return redirect(url_for('gameanno2', id=getId()))


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
        levelList = idm.getRecent(getId())
        idm.write_csv(annotationPath2,
                      [getId(), resultList[0], resultList[1], resultList[2], levelList[0], levelList[1],
                       levelList[2],
                       datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")])

        if idm.getTimes(id):
            return redirect(url_for("over", id=id))
        else:
            idm.addTimes(id)
            return redirect(url_for("gameplay2", id=id))


@app.route("/gameover", methods=['POST', 'GET'])
def over():
    finish = idm.getTimes(getId())
    if request.method == 'POST':
        resultList = list(request.form)[0].split(",")
        idm.write_csv(feedbackPath,
                      [getId(), resultList[0],
                       ""])

    return render_template("GameOver.html", finish=1, stage=1)


# @app.route('/feedback', methods=['POST'])
# def overa():
#     if request.method == 'POST':
#         resultList = list(request.form)[0].split(",")
#         idm.write_csv(feedbackPath,
#                       [getId(), resultList[0],
#                        ""])

# return redirect(url_for("over", id=id))
def saveRepFile(path, filename, content):
    o_dict = json.loads(content)
    action_dict = o_dict["elementData1"][1:]
    actionList = []
    for actions in action_dict:
        try:
            alist = actions["actions0"]
            actionsInput = [alist["0"], alist["1"], alist["2"], alist["3"], alist["4"], alist["5"], alist["6"]]
            actionList.append(serializeAction(actionsInput))
        except Exception:
            continue

    cp = list(map(int, actionList))
    file_dir = os.path.join(os.getcwd(), path)
    file_path = os.path.join(file_dir, filename + ".rep")
    with open(file_path, 'wb') as f:
        f.write(b''.join(struct.pack('B', c) for c in cp))


def serializeAction(actions):
    res = 0
    for i in range(1, 6):
        if actions[i]:
            tmp = 1 << (i-1)
            res += tmp
    return res


def saveJsonFile(path, filename, content):
    file_dir = os.path.join(os.getcwd(), path)
    file_path = os.path.join(file_dir, filename + ".json")
    with open(file_path, 'w') as f:
        f.write(content)

@app.route('/debug-headers')
def debug_headers():
    # 检查原始的 HTTP 头部，看 Caddy 是否发送了 X-Forwarded-Prefix
    x_prefix_header = request.headers.get('X-Forwarded-Prefix')
    
    # 检查 WSGI 环境，看 ProxyFix 是否成功设置了 SCRIPT_NAME
    # SCRIPT_NAME 是 Flask/Werkzeug 用来构建 url_for() 的关键变量
    script_name = request.environ.get('SCRIPT_NAME')
    
    # 检查 url_for 是否包含了前缀
    test_url = url_for('static', filename='test.css')
    
    # 检查所有路由规则，看 'privacy' 路由的构建情况
    routes = []
    # 绑定 URL Map 到当前请求环境，以确保 SCRIPT_NAME 生效
    adapter = app.url_map.bind_to_environ(request.environ)
    
    # 检查 'privacy' 路由生成
    try:
        privacy_url = adapter.build('privacypage', force_external=False, method='GET')
    except Exception as e:
        privacy_url = f"Error building URL: {e}"

    output = f"""
    <h2>Flask 代理调试信息</h2>
    <p><strong>URL_ROOT:</strong> {request.url_root}</p>
    <p><strong>X-Forwarded-Prefix 头部 (Caddy 发送):</strong> <code>{x_prefix_header}</code></p>
    <p><strong>SCRIPT_NAME 环境变量 (ProxyFix 设置):</strong> <code>{script_name}</code></p>
    <p><strong>测试 url_for('static', 'test.css') 生成的 URL:</strong> <code>{test_url}</code></p>
    
    <h3>预期结果:</h3>
    <ul>
        <li>X-Forwarded-Prefix 应该等于 <code>/funmario</code></li>
        <li>SCRIPT_NAME 应该等于 <code>/funmario</code></li>
        <li>测试 URL 应该以 <code>/funmario/static/test.css</code> 开头</li>
    </ul>
    
    <h3>路由检查:</h3>
    <p><strong>'privacypage' 路由生成的 URL:</strong> <code>{privacy_url}</code></p>
    """
    return output

if __name__ == '__main__':
    #saveRepFile(replayDataPath, "null_test.rep", testJson)
    app.run(host='0.0.0.0', port=9881, debug=True)
    # app.run()
