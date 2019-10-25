import sys
import json
import datetime

import twint
from google.cloud import firestore

db = firestore.Client()

filelist = [
    {
        'filepath': 'self_defense.json',
        'classification': 'selfdefense'
    },
    {
        'filepath': 'government_japan.json',
        'classification': 'government'
    },
    {
        'filepath': 'mass_media_japan.json',
        'classification': 'massmedia'
    }
]

def setOrUpdateTweet(classification, user, tweet):
    print(".", end="")
    avatar = None
    if user is not None:
        avatar = user.avatar
    # https://github.com/twintproject/twint/blob/master/twint/tweet.py
    params = {
        'tweet_id_str':   tweet.id_str,
        'user_id_str':    tweet.user_id_str,
        'is_protected':   False,
        'is_retweet':     tweet.retweet,
        'screen_name':    tweet.username,
        'display_name':   tweet.name,
        'icon_url':       avatar,
        'tweeted_at':     datetime.datetime.fromtimestamp(tweet.datetime/1000.0),
        'text':           tweet.tweet,
        'hashtags':       tweet.hashtags,
        'cashtags':       tweet.cashtags,
        'urls':           tweet.urls,
        'photos':         tweet.photos,
        'videos':         [],
        'replies_count':  tweet.replies_count,
        'rt_count':       tweet.retweets_count,
        'fav_count':      tweet.likes_count,
        'score':          tweet.retweets_count + tweet.likes_count,
        'classification': classification,
        'updated_at':     firestore.SERVER_TIMESTAMP,
    }
    # 追加または更新
    docRef = db.collection('tweets').document(tweet.id_str).get()
    if docRef.exists:
        #print('twint update: '+' - '+tweet.username+' - '+tweet.id_str)
        docs = db.collection('tweets').document(tweet.id_str).update(params)
    else:
        #print('twint set: '+' - '+tweet.username+' - '+tweet.id_str)
        detectorParams = {
            'category':       None,
            'place_country':  None,
            'place_pref':     None,
            'place_city':     None,
            'place_river':    None,
            'place_mountain': None,
            'place_station':  None,
            'place_airport':  None,
            'lat':            None,
            'long':           None,
            'geohash':        None,
        }
        finalParams = dict(params)
        finalParams.update(detectorParams)
        docs = db.collection('tweets').document(tweet.id_str).set(finalParams)

def twintAccountPubSub(event, context):
    for fileinfo in filelist:
        classification = fileinfo['classification']
        json_file = open(fileinfo['filepath'], encoding='utf-8')
        account_list = json.load(json_file)
        for account in account_list:
            screen_name = account["twitter"]
            if screen_name is None:
                continue
            start_after = screen_name
            print("twint start: "+screen_name)
            # このへんを毎回空にしないと前回のループの内容が消えない
            twint.output.users_list = []
            twint.output.tweets_list = []
            # https://github.com/twintproject/twint/wiki/Configuration
            # タイムライン取得だけだとアイコンが取得できないのでユーザー情報を取得する
            c = twint.Config()
            c.Username = screen_name
            # Store_object = True にしないと twint.output の中身が空
            c.Store_object = True
            c.Hide_output = True
            twint.run.Lookup(c)
            user = None
            if len(twint.output.users_list) > 0:
                user = twint.output.users_list[0]
            # タイムラインを取得する
            c = twint.Config()
            c.Username = screen_name
            c.Format = 'twint account: '+classification+' - {username} - {id}'
            c.Limit = 20
            c.Store_object = True
            twint.run.Search(c)
            tweets = twint.output.tweets_list
            for tweet in tweets:
                print('twint classification: '+classification)
                setOrUpdateTweet(classification, user, tweet)

keywordfile = 'detector_category_words.json'

def twintKeywordPubSub(event, context):
    json_file = open(keywordfile, encoding='utf-8')
    category_dict = json.load(json_file)
    for category in category_dict:
        if category == "other":
            continue
        if category == "sports":
            continue
        for keyword in category_dict[category]:
            start_after = keyword
            twint.output.tweets_list = []
            c = twint.Config()
            c.Search = keyword+" filter:links -filter:replies -filter:retweets -filter:nativeretweets"
            c.Format = 'twint search: '+category+'/'+keyword+' - {username} - {id}'
            c.Limit = 20
            c.Store_object = True
            twint.run.Search(c)
            tweets = twint.output.tweets_list
            print(".", end="")
            for tweet in tweets:
                print(".", end="")
                if tweet.tweet.startswith('RT'):
                    continue
                if len(tweet.urls) == 0:
                    continue
                twint.output.users_list = []
                c = twint.Config()
                c.Username = tweet.username
                c.Store_object = True
                c.Hide_output = True
                twint.run.Lookup(c)
                user = None
                if len(twint.output.users_list) > 0:
                    user = twint.output.users_list[0]
                setOrUpdateTweet(None, user, tweet)
            print(".")


target = None
if __name__ == "__main__":
    if (len(sys.argv)>1):
        target = sys.argv[1]
    if target is not None:
        if target == "account":
            twintAccountPubSub(None, None)
        if target == "keyword":
            twintKeywordPubSub(None, None)