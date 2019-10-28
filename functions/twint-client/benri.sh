
cp -r ../data/yuiseki.net/*.json .

python main.py account yuiseki
python sub.py rt yuiseki

python main.py category crisis only_link
python main.py category accident only_link
python main.py category incident only_link
python main.py category children only_link
python main.py category drug only_link
python main.py category japan only_link

python main.py category feminism