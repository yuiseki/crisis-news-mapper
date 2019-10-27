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
        'filepath': 'mass_media_japan.json',
        'classification': 'massmedia'
    },
    {
        'filepath': 'government_japan.json',
        'classification': 'government'
    }
]
keywordfile = 'detector_category_words.json'


def setOrUpdateTweet(classification, user, tweet):
    """
    tweetをfirestoreに保存するメソッド
    """
    # https://github.com/twintproject/twint/blob/master/twint/user.py
    icon_url = None
    bio = None
    location = None
    following = None
    followers = None
    if user is not None:
        icon_url = user.avatar
        bio = user.bio
        location = user.location
        following = user.following
        followers = user.followers
    # https://github.com/twintproject/twint/blob/master/twint/tweet.py
    params = {
        'tweet_id_str':   tweet.id_str,
        'user_id_str':    tweet.user_id_str,
        'user_bio':       bio,
        'user_location':  location,
        'user_following': following,
        'user_followers': followers,
        'is_protected':   False,
        'is_retweet':     tweet.retweet,
        'rt_screen_name': tweet.user_rt,
        'rt_id_str':      tweet.retweet_id,
        'screen_name':    tweet.username,
        'display_name':   tweet.name,
        'tweet_url':      tweet.link,
        'icon_url':       icon_url,
        'tweeted_at':     datetime.datetime.fromtimestamp(tweet.datetime/1000.0),
        'text':           tweet.tweet,
        'hashtags':       tweet.hashtags,
        'hashtags_count': len(tweet.hashtags),
        'cashtags':       tweet.cashtags,
        'cashtags_count': len(tweet.cashtags),
        'urls':           tweet.urls,
        'urls_count':     len(tweet.urls),
        'photos':         tweet.photos,
        'photos_count':   len(tweet.photos),
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
        docs = db.collection('tweets').document(tweet.id_str).update(params)
    else:
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
            'created_at':     firestore.SERVER_TIMESTAMP,
        }
        finalParams = dict(params)
        finalParams.update(detectorParams)
        docs = db.collection('tweets').document(tweet.id_str).set(finalParams)


def twintSearchTimeline(classification, screen_name, limit):
    """
    screen_nameを指定してタイムラインを取得しfirestoreに保存するメソッド
    """
    print("twint account: "+screen_name)
    # このへんを毎回空にしないと twint.output の前回のループの内容が消えない
    twint.output.users_list = []
    twint.output.tweets_list = []
    # https://github.com/twintproject/twint/wiki/Configuration
    # タイムライン取得だけだとアイコンが取得できないので
    # ユーザー情報を取得する
    c = twint.Config()
    # Store_object = True にしないと twint.output の中身が空
    c.Store_object = True
    # 標準出力にログ出力しない
    c.Hide_output = True
    c.Username = screen_name
    twint.run.Lookup(c)
    user = None
    if len(twint.output.users_list) > 0:
        user = twint.output.users_list[0]
    # タイムラインを取得する
    c = twint.Config()
    c.Store_object = True
    # 標準出力へのログ出力のフォーマット
    c.Format = 'twint account: '+classification+' - {username} - {id}'
    # retweetを含める
    c.Retweets = True
    c.Limit = limit
    c.Username = screen_name
    twint.run.Profile(c)
    tweets = twint.output.tweets_list
    for tweet in tweets:
        setOrUpdateTweet(classification, user, tweet)


def twintSearchKeyword(classification, query, limit):
    """
    キーワードを指定してTwitter検索を実行しfirestoreに保存するメソッド
    """
    twint.output.tweets_list = []
    c = twint.Config()
    c.Store_object = True
    c.Format = 'twint search: '+classification+' - '+query+' - {username} - {id}'
    # recent or popular
    c.Popular_tweets = True
    # RTを除外
    Filter_retweets = True
    # リンクを含むツイートのみ
    #c.Links = 'include'
    c.Limit = limit
    c.Search = query
    twint.run.Search(c)
    tweets = twint.output.tweets_list
    for tweet in tweets:
        if tweet.tweet.startswith('RT'):
            continue
        if len(tweet.urls) == 0:
            continue
        # アイコン取得
        twint.output.users_list = []
        c = twint.Config()
        c.Store_object = True
        c.Hide_output = True
        c.Username = tweet.username
        twint.run.Lookup(c)
        user = None
        if len(twint.output.users_list) > 0:
            user = twint.output.users_list[0]
        setOrUpdateTweet(classification, user, tweet)


def twintAccountPubSub(event, context):
    """
    cloud function: twintAccountPubSub
    mass_media_japan.json, self_defense.json, government_japan.json
    各ファイルにリストされている全Twitterアカウントのタイムラインを取得する目的
    """
    for fileinfo in filelist:
        classification = fileinfo['classification']
        json_file = open(fileinfo['filepath'], encoding='utf-8')
        account_list = json.load(json_file)
        for account in account_list:
            screen_name = account["twitter"]
            if screen_name is None:
                continue
            twintSearchTimeline(classification, screen_name, 20)


def twintDomainPubSub(event, context):
    """
    cloud function: twintDomainPubSub
    mass_media_japan.json 内の全ドメインで検索する
    ニュース記事に言及しているツイートを集める目的
    """
    json_file = open('mass_media_japan.json', encoding='utf-8')
    json_list = json.load(json_file)
    for item in json_list:
        query = item["query"]
        twintSearchKeyword("massmedia", query, 100)


skip_category = [
    "support",
    "survey",
    "caution",
    "rescue",
    "fire",
    "other",
    "politics",
    "sports",
    "nationwide"
]
def twintKeywordPubSub(event, context):
    """
    cloud function: twintKeywordPubSub
    detector_category_words.json 内の全キーワードで検索する
    各カテゴリのツイートを集めるのが目的
    """
    json_file = open(keywordfile, encoding='utf-8')
    category_dict = json.load(json_file)
    for category in category_dict:
        if category in skip_category:
            continue
        for keyword in category_dict[category]:
            twintSearchKeyword("keyword", keyword, 100)


def twintCategorySearch(category):
    json_file = open(keywordfile, encoding='utf-8')
    category_dict = json.load(json_file)
    if category in category_dict:
        for keyword in category_dict[category]:
            twintSearchKeyword(category, keyword, 2000)


def printUsage():
    print("""
python main.py domain
    twintDomainPubSub(None, None)
    search all domains listed in mass_media_japan.json
python main.py account
    twintAccountPubSub(None, None)
    retrieve tweets of all accounts listed in mass_media_japan.json, self_defense.json, government_japan.json
python main.py account screen_name
    twintSearchTimeline("timeline", screen_name, 1000)
    retrieve tweets of specific account
python main.py category category_name
    twintCategorySearch(category_name)
    search specific category listed in detector_category_words.json
python main.py keyword
    twintKeywordPubSub(None, None)
    search all keywords listed in detector_category_words.json
python main.py keyword keyword_string
    twintSearchKeyword(None, keyword_string, 2000)
    search specific keyword
python main.py keyword keyword_string classification_string
    twintSearchKeyword(classification_string, keyword_string, 2000)
    search specific keyword and classified by classification_string
""")

targetMethod = None
optionalArg = None
extraArg = None
if __name__ == "__main__":
    if (len(sys.argv) == 1):
        printUsage()
    if (len(sys.argv) >= 2):
        targetMethod = sys.argv[1]
    if (len(sys.argv) >= 3):
        optionalArg = sys.argv[2]
    if (len(sys.argv) >= 4):
        extraArg = sys.argv[3]
    if targetMethod is not None:
        if targetMethod == "domain":
            twintDomainPubSub(None, None)
        if targetMethod == "account":
            if optionalArg is None:
                twintAccountPubSub(None, None)
            else:
                twintSearchTimeline("timeline", optionalArg, 500)
        if targetMethod == "category":
            if optionalArg is not None:
                twintCategorySearch(optionalArg)
        if targetMethod == "keyword":
            if optionalArg is None:
                twintKeywordPubSub(None, None)
            else:
                if extraArg is None:
                    twintSearchKeyword(None, optionalArg, 2000)
                else:
                    twintSearchKeyword(extraArg, optionalArg, 2000)