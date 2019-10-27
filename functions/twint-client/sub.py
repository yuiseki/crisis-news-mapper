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
  response = requests.get(photo_url)
  content_type = response.headers['content-type']
  print(content_type)
  last_modified = response.headers['last-modified']
  print(last_modified)
  timestamp = str(int(parse(last_modified).timestamp()))
  parsed_url = urlparse(photo_url)
  filename = os.path.basename(parsed_url.path)
  print(filename)
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


def saveRetweetedPhotosOf(screen_name):
  query = db.collection('tweets').where(
    'rt_screen_name', '==', screen_name).order_by(
    'tweeted_at', direction=firestore.Query.DESCENDING).limit(10000)
  for doc in query.stream():
    tweet = doc.to_dict()
    if 'is_retweet' in tweet and not tweet['is_retweet']:
      continue
    tweet_url = tweet['tweet_url']
    print(u'url: {}'.format(tweet_url))
    for photo_url in tweet['photos']:
      print(u'photo: {}'.format(photo_url))
      fetchAndUpload(tweet, photo_url)


disorders = json.loads('detector_disorder_words.json')
def detectDisoder():
  query = db.collection('tweets').where('classification', '==', 'feminism').limit(100000)
  for doc in query.stream():
    tweet = doc.to_dict()
    bio = tweet['user_bio'] if 'user_bio' in tweet else ''
    display_name = tweet['display_name']
    for disoder in disorders:
      if disoder in bio or disoder in display_name:
        print(u'screen_name: {}, disoder: {}'.format(tweet['screen_name'], disoder))


targetType = None
targetArg = None
if __name__ == "__main__":
  if (len(sys.argv) >= 2):
    targetType = sys.argv[1]
  if (len(sys.argv) >= 3):
    targetArg = sys.argv[2]
  if targetType is not None:
    if targetType == "disorder":
      detectDisoder()
    if targetType == "retweet" and targetArg is not None:
      saveRetweetedPhotosOf(targetArg)