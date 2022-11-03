import random
import csv
class idManager():
    levelNum = 200
    ip_dic = {}
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

        #return ["lvl"+str(levels[0]),"lvl"+str(levels[1])]
        return ["test1","test2"]

    def write_csv(self,path, data):
        with open(path, 'a+') as f:
            csv_write = csv.writer(f)
            csv_write.writerow(data)