
cp -r ../data/yuiseki.net/*.json .

python3 main.py account yuiseki
python3 sub.py rt yuiseki

python3 main.py category crisis only_link
python3 main.py category incident only_link
python3 main.py category children only_link
python3 main.py category drug only_link
python3 main.py category japan only_link
python3 main.py category feminism