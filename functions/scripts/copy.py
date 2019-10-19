
from os import listdir
from os.path import isfile, isdir, join, sep
from os import walk

import shutil

srcDir = r"D:\data\W05"
destDir = r"C:\Users\yuise\crisis-news-mapper\functions\data\nlftp.mlit.go.jp\W05"

for path in listdir(srcDir):
    dirfullpath = srcDir+sep+path
    if(isdir(dirfullpath)):
        print(dirfullpath)
        for filename in listdir(dirfullpath):
            # W05-06_36-g.xml
            if(filename.startswith('W05') and filename.endswith('xml')):
                filefullpath = dirfullpath+sep+filename
                shutil.copy(filefullpath, destDir)
