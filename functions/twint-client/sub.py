import os
import sys
import json
import time
import datetime

import requests
from urllib.parse import urlparse
from dateutil.parser import parse

import firebase_admin
from firebase_admin import firestore
from firebase_admin import storage

firebase_admin.initialize_app()
db = firestore.Client()
bucket = storage.bucket("twitter-photos")


def fetchAndUpload(tweet, photo_url):
  '''
  Twitterの画像をfirebase storageに保存するメソッド
  '''
  parsed_url = urlparse(photo_url)
  filename = os.path.basename(parsed_url.path)
  print(filename)
  # すでにbucketにあったら取得しない
  if bucket.get_blob(filename) is None:
    time.sleep(0.5)
    response = requests.get(photo_url)
    # 謎だけどたまにこういうやつがいるので無視
    if not 'content-type' in response.headers:
      return
    content_type = response.headers['content-type']
    print(content_type)
    # 謎だけどたまにこういうやつがいるので無視
    if not 'last-modified' in response.headers:
      return
    last_modified = response.headers['last-modified']
    print(last_modified)
    timestamp = str(int(parse(last_modified).timestamp()))
    blob = bucket.blob(filename)
    blob.metadata = {
      'score': tweet['score'],
      'screen_name': tweet['screen_name'],
      'tweet_id_str': tweet['tweet_id_str'],
      'tweet_url': tweet['tweet_url'],
      'timestamp': timestamp
    }
    blob.upload_from_string(
        response.content,
        content_type=content_type
    )


def savePhotosOf(screen_name):
  '''
  firebase firestoreのtweetsコレクションからscreen_nameのツイートを探して
  そのツイートが画像を持っていたらfirebase storageに保存する
  '''
  query = db.collection('tweets').where(
    'screen_name', '==', screen_name).where(
    'photos_count', '>', 0).limit(10000)
  for doc in query.stream():
    tweet = doc.to_dict()
    tweet_url = tweet['tweet_url']
    for photo_url in tweet['photos']:
      fetchAndUpload(tweet, photo_url)


def saveRetweetedPhotosOf(screen_name):
  '''
  firebase firestoreのtweetsコレクションからscreen_nameがRTしたツイートを探して
  そのツイートが画像を持っていたらfirebase storageに保存する
  '''
  query = db.collection('tweets').where(
    'rt_screen_name', '==', screen_name).order_by(
    'tweeted_at', direction=firestore.Query.DESCENDING).limit(1000)
  for doc in query.stream():
    tweet = doc.to_dict()
    if 'is_retweet' in tweet and not tweet['is_retweet']:
      continue
    tweet_url = tweet['tweet_url']
    for photo_url in tweet['photos']:
      fetchAndUpload(tweet, photo_url)


def importArchivedTweets(filename):
  '''
  Twitterの全ツイート履歴を取り込むためのメソッド
  '''
  json_file = open(filename, encoding='utf-8')
  tweets = json.load(json_file)
  for tweet in tweets:
    if len(tweet['entities']['user_mentions']) > 0 and 'media' in tweet['entities']:
      screen_name = tweet['entities']['user_mentions'][0]['screen_name']
      # mediaは複数ある配列
      for media in tweet['entities']['media']:
        # RTじゃない
        if not 'source_status_id' in media:
          continue
        tweet_id_str = media['source_status_id']
        tweet_url = 'https://twitter.com/'+screen_name+'/status/'+tweet_id_str
        photo_url = media['media_url_https']
        param = {
          'score': 0,
          'screen_name': screen_name,
          'tweet_id_str': tweet_id_str,
          'tweet_url': tweet_url,
        }
        fetchAndUpload(param, photo_url)


disorderCounter = {}
users = []
def detectDisoder(classification):
  '''
  classificationで指定したtweetsに精神障害者がどれくらいいるのか調べるメソッド
  '''
  json_file = open('./detector_disorder_words.json', encoding='utf-8')
  disorders = json.load(json_file)
  query = db.collection('tweets').where('classification', '==', classification)
  count = 0
  for doc in query.stream():
    count = count + 1
    tweet = doc.to_dict()
    if not 'user_bio' in tweet:
      continue
    user_bio = tweet['user_bio']
    screen_name = tweet['screen_name']
    display_name = tweet['display_name']
    if not screen_name in users:
      users.append(screen_name)
    for disoder in disorders:
      if disoder in user_bio or disoder in display_name:
        if screen_name in disorderCounter and disoder not in disorderCounter[screen_name]:
          disorderCounter[screen_name] = disorderCounter[screen_name]+', '+disoder
        else:
          disorderCounter[screen_name] = disoder
  print('classification: '+classification)
  print('all: '+str(count)+' tweets')
  print('all: '+str(len(users))+' users')
  print('disorders: '+str(len(disorderCounter))+' users')
  print(str(len(disorderCounter)/len(users))+'%')
  print(disorderCounter)

def analyzeRetweet(tweet_url):
  print("analyzeRetweet")

targetMethod = None
targetArg = None
if __name__ == "__main__":
  if (len(sys.argv) >= 2):
    targetMethod = sys.argv[1]
  if (len(sys.argv) >= 3):
    targetArg = sys.argv[2]
  if targetMethod is not None:
    if targetMethod == "disorder" and targetArg is not None:
      detectDisoder(targetArg)
    if targetMethod == "archive" and targetArg is not None:
      importArchivedTweets(targetArg)
    if targetMethod == "save_photo" and targetArg is not None:
      savePhotosOf(targetArg)
    if targetMethod == "save_rt_photo" and targetArg is not None:
      saveRetweetedPhotosOf(targetArg)
    if targetMethod == "analyze_rt" and targetArg is not None:
      analyzeRetweet(targetArg)