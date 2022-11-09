import random
import csv
class idManager():
    levelNum = 200
    ip_dic = {}
    ip_recent = {}
    ip_control = {}
    def __int__(self):
        self.levelNum = 200


    def getLevels(self,ip):
        if ip not in self.ip_dic.keys():
            self.ip_dic[ip] = []

        levels = [random.randint(1,self.levelNum), random.randint(1,self.levelNum)]
        while levels[0] in self.ip_dic[ip]:
            levels[0] = random.randint(1,self.levelNum)
        self.ip_dic[ip].append(levels[0])
        while levels[1] in self.ip_dic[ip]:
            levels[1] = random.randint(1, self.levelNum)
        self.ip_dic[ip].append(levels[1])

        self.ip_recent[ip] = [levels[0],levels[1]]
        return ["lvl"+str(levels[0]),"lvl"+str(levels[1])]
        #return ["test1","test2"]

    def getRecent(self,ip):
        return self.ip_recent[ip]
    def setControl(self,ip,content):
        if content == "A":
            self.ip_control[ip] = 0
        else:
            self.ip_control[ip] = 1


    def getControl(self,ip):
        return self.ip_control[ip]
    def write_csv(self,path, data):
        with open(path, 'a+') as f:
            csv_write = csv.writer(f)
            csv_write.writerow(data)