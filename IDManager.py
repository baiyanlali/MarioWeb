import random
import csv


class idManager():
    levelNum = 200
    typeNum = 100
    gid = 0

    timeMin = 1
    tutorialMax = 3
    ip_id = {}
    ip_dic = {}
    ip_recent = {}
    ip_control = {}
    ip_time = {}
    ip_tutorial = {}
    ip_type = {}

    def __int__(self):
        self.levelNum = 200
        self.typeNum = 100
        self.timeMin = 1
        self.gid = 0

    def iniId(self, ip):
        self.gid += 1
        self.ip_dic[ip] = str(self.gid)
        return str(self.gid)

    def getId(self, ip):
        return self.ip_dic[ip]

    def getLevels(self, ip):
        if ip not in self.ip_dic.keys():
            self.ip_dic[ip] = []

        levels = [random.randint(1, self.levelNum), random.randint(1, self.levelNum)]
        while levels[0] in self.ip_dic[ip]:
            levels[0] = random.randint(1, self.levelNum)
        self.ip_dic[ip].append(levels[0])
        while levels[1] in self.ip_dic[ip]:
            levels[1] = random.randint(1, self.levelNum)
        self.ip_dic[ip].append(levels[1])

        self.ip_recent[ip] = [levels[0], levels[1]]
        return ["lvl" + str(levels[0]), "lvl" + str(levels[1])]
        # return ["test1","test2"]

    def getTypeLevels(self, ip):
        if ip not in self.ip_type.keys():
            self.ip_type[ip] = []
        result = [0, 0, 0]
        # [c,k,r]

        tmp = random.randint(0, self.typeNum - 1)
        while "c" + str(tmp) in self.ip_type[ip]:
            tmp = random.randint(0, self.typeNum - 1)
        result[0] = "Collector-" + str(tmp)
        self.ip_type[ip].append("c" + str(tmp))

        tmp = random.randint(0, self.typeNum - 1)
        while "k" + str(tmp) in self.ip_type[ip]:
            tmp = random.randint(0, self.typeNum - 1)
        result[1] = "Killer-" + str(tmp)
        self.ip_type[ip].append("k" + str(tmp))

        tmp = random.randint(0, self.typeNum - 1)
        while "r" + str(tmp) in self.ip_type[ip]:
            tmp = random.randint(0, self.typeNum - 1)
        result[2] = "Runner-" + str(tmp)
        self.ip_type[ip].append("r" + str(tmp))

        self.ip_recent[ip] = result
        return result

    def getRecent(self, ip):
        return self.ip_recent[ip]

    def getLevel(self, ip):
        if ip not in self.ip_dic.keys():
            self.ip_dic[ip] = []
        level = random.randint(1, self.levelNum)
        while level in self.ip_dic[ip]:
            level = random.randint(1, self.levelNum)
        self.ip_dic[ip].append(level)
        self.ip_recent[ip] = level
        return "lvl" + str(level)

    def setControl(self, ip, content):
        if content == "A":
            self.ip_control[ip] = 0
        else:
            self.ip_control[ip] = 1

    def setTimes(self, ip):
        self.ip_time[ip] = 0

    def getTimes(self, ip):

        if ip not in self.ip_time.keys():
            self.ip_time[ip] = 0

        if self.ip_time[ip] >= self.timeMin:
            return 1
        else:
            return 0

    def addTimes(self, ip):
        if ip not in self.ip_time.keys():
            self.ip_time[ip] = 0
        self.ip_time[ip] = self.ip_time[ip] + 1
        return self.ip_time[ip]

    def addTutorial(self, ip):

        if ip not in self.ip_tutorial.keys():
            self.ip_tutorial[ip] = 1
            return 1
        else:
            if self.ip_tutorial[ip] > self.tutorialMax:
                return 1
            else:
                self.ip_tutorial[ip] = self.ip_tutorial[ip] + 1
                return self.ip_tutorial[ip]

    def hasNextTutorial(self, ip):
        if self.ip_tutorial[ip] == self.tutorialMax:
            return 0
        else:
            return 1

    def getControl(self, ip):
        return self.ip_control[ip]

    def write_csv(self, path, data):
        with open(path, 'a+', newline='') as f:
            csv_write = csv.writer(f)
            csv_write.writerow([*data, ''])
