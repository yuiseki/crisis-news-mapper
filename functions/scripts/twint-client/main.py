import json
import datetime

import twint
from google.cloud import firestore

db = firestore.Client()

filelist = [
    {
        'filepath': './data/yuiseki.net/self_defense.json',
        'classification': 'selfdefense'
    },
    {
        'filepath': './data/yuiseki.net/government_japan.json',
        'classification': 'government'
    },
    {
        'filepath': './data/yuiseki.net/mass_media_japan.json',
        'classification': 'massmedia'
    }
]

def twint_pubsub(event, context):
    for fileinfo in filelist:
        classification = fileinfo['classification']
        json_file = open(fileinfo['filepath'])
        account_list = json.load(json_file)
        for account in account_list:
            screen_name = account["twitter"]
            if screen_name is None:
                continue
            print("twint start: "+screen_name)
            c = twint.Config()
            c.Username = screen_name
            c.Format = 'twint tweet: {username} - {id}'
            #c.Hide_output = True
            c.Limit = 100
            c.Store_object = True
            twint.run.Search(c)
            tweets = twint.output.tweets_list
            for tweet in tweets:
                params = {
                    'tweet_id_str':   tweet.id_str,
                    'user_id_str':    tweet.user_id_str,
                    'is_protected':   False,
                    'is_retweet':     tweet.retweet,
                    'screen_name':    tweet.username,
                    'display_name':   tweet.name,
                    'icon_url':       None,
                    'tweeted_at':     tweet.datetime,
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
                    'updated_at':     firestore.SERVER_TIMESTAMP,
                }
                docRef = db.collection('tweets').document(tweet.id_str).get()
                if not docRef.exists:
                    print('twint: write to firestore '+tweet.id_str)
                    docs = db.collection('tweets').document(tweet.id_str).set(params)

if __name__ == "__main__":
    twint_pubsub(None, None)