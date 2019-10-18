

const admin = require('firebase-admin')

const TwitterClient = require('twitter')

const dotenv = require('dotenv')
dotenv.config()
const consumer_key = process.env.CONSUMER_KEY
const consumer_secret = process.env.CONSUMER_SECRET
const access_token_key = process.env.ACCESS_TOKEN_KEY
const access_token_secret = process.env.ACCESS_TOKEN_SECRET
const client = new TwitterClient({
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret
})

import { News } from './news'
import { Detector } from './detector'

export class Twitter {

  public static selfDefenseAccountList = [
    // 防衛省 自衛隊
    "ModJapan_saigai",


    // 陸上総隊司令部
    "jgsdf_gcc_pao",
    // 師団
    // 第一師団
    "1D_nerima",
    // 第三師団
    "JGSDF_MA_3D",
    // 第十師団
    "JGSDF_MA_10D",
    // 旅団
    // 第五旅団
    "5b_na_jgsdf",
    // 第十三旅団
    "13b_jgsdf",
    // 第十五旅団
    "jgsdf_15b_pr",
    // 第七普通科連隊
    "7th_Inf_Kyoto",
    // 第一空挺団
    "jgsdf_1stAbnB",
    // 第一ヘリコプター団
    "1st_helb",


    // 陸上自衛隊 北部方面隊
    "northernarmy_pr",
    // 旭川地方協力本部
    // ない！！！
    // 帯広地方協力本部
    "hq1obihiropco",
    // 札幌地方協力本部
    "sapporo_PCO",
    // 函館地方協力本部
    // ない！！！


    // 陸上自衛隊 東北方面隊
    "NeaAdminpr",
    // 岩手地方協力本部
    "iwate_pco",
    // 福島地方協力本部
    "Fukushimapco",
    // 秋田地方協力本部
    "jieitaiakitapco",
    // 青森地方協力本部
    "aomori_PCO",
    // 山形地方協力本部
    "yamagata_pco",
    // 宮城地方協力本部
    "miyagipco",


    // 陸上自衛隊 東部方面隊
    "JGSDF_EA_PR",
    // 群馬地方協力本部
    "gunma_pco",
    // 栃木地方協力本部
    "tochigi_pco",
    // 茨城地方協力本部
    // ない！！！
    // 埼玉地方協力本部
    "saitamapco",
    // 千葉地方協力本部
    "chiba_pco",
    // 東京地方協力本部
    "tokyo_pco",
    // 神奈川地方協力本部
    "kanagawa_pco",


    // 陸上自衛隊 中部方面隊
    "JGSDF_MA_pr",
    // 新潟地方協力本部
    "niigata_pco",
    // 富山地方協力本部
    "toyama_pco",
    // 石川地方協力本部
    "ishikawa_pco",
    // 福井地方協力本部
    "fukui_pco",
    // 山梨地方協力本部
    "yamanashi_pco",
    // 長野地方協力本部
    "pconagano",
    // 岐阜地方協力本部
    "gifupco",
    // 静岡地方協力本部
    "shizuoka_pco",
    // 愛知地方協力本部
    // ない！！！


    // 陸上自衛隊 西部方面隊
    "JGSDF_WA_pr",
    // 滋賀地方協力本部
    "shigapco",
    // 三重地方協力本部
    "mie_pco",
    // 京都地方協力本部
    "kyotopco",
    // 奈良地方協力本部
    "narapco",
    // 大阪地方協力本部
    "osaka_pco",
    // 和歌山地方協力本部
    "wakayama_pco",
    // 兵庫地方協力本部
    "pco_hyogo",
    // 鳥取地方協力本部
    "tottoripcojsdf",
    // 岡山地方協力本部
    "okayamaPCO",
    // 島根地方協力本部
    "shimane_pco",
    // 広島地方協力本部
    // ない！！！
    // 山口地方協力本部
    "yamaguchi_pco",
    // 四国
    // 香川地方協力本部
    // ない！！！
    // 徳島
    "tokushima_pco",
    // 愛媛
    "ehime_pco",
    // 高知
    "pco_kochi",
    // 九州
    // 大分地方協力本部
    "oita_pco",
    // 宮崎
    "miyazaki_pco",
    // 鹿児島地方協力本部
    "kagoshima_pco",
    // 福岡
    "fukuoka_PCO",
    // 熊本
    "kumamotopco",
    // 佐賀
    "saga_pco",
    // 長崎
    "nagasakichihon",
    // 沖縄
    // ない！！！

  ]

  public static queryList = [
    // 新聞 5
    'yomiuri.co.jp',
    'mainichi.jp',
    'asahi.com',
    'sankei.com',
    'nikkei.com',
    // TV 5
    'nhk.or.jp',
    'news24.jp',
    'news.tbs.co.jp',
    'fnn.jp',
    'news.tv-asahi.co.jp',
    // 通信社 4
    'this.kiji.is',
    '47news',
    'jiji.com',
    'www.afpbb.com',
    // Web ニュース 3
    'news.yahoo.co.jp',
    'headlines.yahoo.co.jp',
    'times.abema.tv',
    // UTF-8じゃない
    //'news.livedoor.com',
    // 海外 ニュース 1
    'www.bbc.com/japanese',
    // 行政 11
    // 内閣府
    'cao.go.jp',
    // 内閣府 防災情報
    'bousai.go.jp',
    // 首相官邸
    'kantei.go.jp',
    // 防衛省 自衛隊
    'mod.go.jp',
    // 気象庁
    'jma.go.jp',
    // 国土交通省
    'mlit.go.jp',
    // 総務省 消防庁
    'fdma.go.jp',
    // 厚生労働省
    'mhlw.go.jp',
    // 経済産業省
    'meti.go.jp',
    // インフラ
    // 東京電力
    // TODO: 全国の電力会社
    'tepco.co.jp',
    // キーワード 5
    '自衛隊',
    '災害',
    '被災',
    '地震',
    '台風',
    // 水 5
    '洪水',
    '浸水',
    '冠水',
    '氾濫',
    '決壊',
    // 山 2
    '崖崩れ',
    '土砂',
    // ライフライン 4
    '停電',
    '断水',
    '給水',
    '通信障害',
  ]

  public crawlAccountTwitter = async (context) => {
    console.log("----> crawlAccountTwitter start")
    const now = new Date()
    let query
    if (Twitter.selfDefenseAccountList.length > now.getMinutes()+1){
      query = Twitter.selfDefenseAccountList[now.getMinutes()]
    }
    await this.searchTweetsAndSave("from:"+query)
    console.log("----> crawlAccountTwitter finish")
  }

  /**
   * twitterの検索を実行する非同期メソッド
   * functionsは最大540秒でタイムアウトしてしまう
   * 毎分実行し、毎分ちがうqueryで検索する
   */
  public crawlSearchTwitter = async (context) => {
    console.log("----> crawlSearchTwitter start")
    const now = new Date()
    let query
    if (Twitter.queryList.length > now.getMinutes()+1){
      query = Twitter.queryList[now.getMinutes()]
    }
    await this.searchTweetsAndSave(query)
    console.log("----> crawlSearchTwitter finish")
  }

  /**
   * Twitterを検索してその結果をfirestoreに保存する非同期メソッド
   * @param {string} query 検索クエリ文字列
   */
  public searchTweetsAndSave = async (query) => {
    console.log("----> searchTweetsAndSave start: "+query)
    // awaitで検索結果を待つ
    const results:any = await this.searchTweetsAsync(query)
    // 検索結果を保存する
    for (const tweet of results) {
      // awaitで保存を待つ
      await this.saveTweetAsync(tweet)
    }
    console.log("----> searchTweetsAndSave finish: "+query)
  }

  /**
   * Twitterの検索APIを呼び検索結果を返す非同期メソッド
   * @param {string} query 検索クエリ文字列
   * @return {tweets[]} 検索結果
   */
  public searchTweetsAsync = async (query) => {
    return new Promise((resolve, reject)=>{
      console.log("----> searchTweetPromise start : "+query)
      const params = {q: query+" exclude:retweets", result_type:'recent', count: 100}
      client.get('search/tweets', params, (error, results, response) => {
        if (error){
          console.log("error: "+error)
          reject(error)
        }else{
          console.log("----> searchTweetPromise finish : "+query)
          resolve(results.statuses)
        }
      })
    })
  }

  /**
   * firestoreのtweetコレクションにtweetを保存する非同期メソッド
   * @param {tweet} tweet
   */
  public saveTweetAsync = async (tweet) => {
    // ツイートに含まれるURLを得る
    const urls = []
    for (const idx in tweet.entities.urls){
      const url = tweet.entities.urls[idx].expanded_url
      urls.push(url)
    }
    // ツイートに含まれる写真、動画、gifを得る
    const photos = []
    let video = null
    for (const idx in tweet.entities.media){
      switch(tweet.entities.media[idx].type){
        case "photo":
          photos.push(tweet.entities.media[idx].media_url_https)
          break
        case "video":
          video = tweet.entities.media[idx].video_info.variants[0].url
          break
        case "animated_gif":
          video = tweet.entities.media[idx].video_info.variants[0].url
          break
      }
    }
    let classification
    if(Twitter.selfDefenseAccountList.includes(tweet.user.screen_name)){
      classification = "selfdefense"
    }else{
      classification = null
    }
    // ツイートのカテゴリ、位置情報を検出する
    const detector = new Detector(tweet.text)
    await detector.ready
    // firestoreに保存するdocument objectを組み立てる
    const tweetDoc = {
      tweet_id_str:   tweet.id_str,
      user_id_str:    tweet.user.id_str,
      is_protected:   tweet.user.protected,
      screen_name:    tweet.user.screen_name,
      display_name:   tweet.user.name,
      icon_url:       tweet.user.profile_image_url_https,
      text:           tweet.text,
      urls:           urls,
      photos:         photos,
      videos:         video,
      rt_count:       tweet.retweet_count,
      fav_count:      tweet.favorite_count,
      score:          tweet.retweet_count + tweet.favorite_count,
      classification: classification,
      category:       detector.category,
      place_country:  detector.country,
      place_pref:     detector.pref,
      place_city:     detector.city,
      place_river:    detector.river,
      place_mountain: detector.mountain,
      place_station:  detector.station,
      place_airport:  detector.airport,
      lat:            detector.location.lat,
      long:           detector.location.long,
      geohash:        detector.geohash,
      tweeted_at:     new Date(Date.parse(tweet.created_at)),
      updated_at:     admin.firestore.FieldValue.serverTimestamp(),
    }
    // tweet idをキーにして保存する
    await admin.firestore().collection('tweets').doc(tweet.id_str).set(tweetDoc)
    // newsコレクションも更新する
    for (const url of urls){
      const news = new News(url)
      await news.ready
      if (news.exists){
        await news.updateByLastTweet(tweet, url)
      }else{
        await news.setOrUpdateNews(tweet)
      }
    }
  }

  public static updateTweetAsync = async (tweetData) => {
    const text = tweetData.text
    const detector = new Detector(text)
    await detector.ready
    const tweetDoc = {
      category:       detector.category,
      place_country:  detector.country,
      place_pref:     detector.pref,
      place_city:     detector.city,
      place_river:    detector.river,
      place_mountain: detector.mountain,
      place_station:  detector.station,
      place_airport:  detector.airport,
      lat:            detector.location.lat,
      long:           detector.location.long,
      geohash:        detector.geohash,
      updated_at:     admin.firestore.FieldValue.serverTimestamp(),
    }
    await admin.firestore().collection("tweets").doc(tweetData.tweet_id_str).update(tweetDoc)
  }

  public static updateAllTweetsByDocRef = (docRef)=>{
    return new Promise(async (resolve, reject)=>{
      const tweetSnapshot = await admin.firestore().collection("tweets")
        .orderBy('updated_at', 'desc')
        .startAfter(docRef)
        .limit(1)
        .get()
      if (tweetSnapshot.empty) {
        reject('No matching documents!')
      }else{
        const data = tweetSnapshot.docs[0].data()
        await Twitter.updateTweetAsync(data)
        await Twitter.updateAllTweetsByDocRef(tweetSnapshot.docs[0])
      }
    })
  }

  public static updateAllTweets = async() => {
    return new Promise(async (resolve, reject)=>{
      console.log("----> updateAllTweets start: ")
      const now = new Date()
      const tenMinutesAgo = new Date(now.getTime() - 60 * 10)
      const tweetSnapshot = await admin.firestore().collection("tweets")
        .orderBy('updated_at', 'desc')
        .startAfter(tenMinutesAgo)
        .limit(1)
        .get()
      if (tweetSnapshot.empty) {
        reject('No matching documents!')
      }else{
        const data = tweetSnapshot.docs[0].data()
        await Twitter.updateTweetAsync(data)
        await Twitter.updateAllTweetsByDocRef(tweetSnapshot.docs[0])
      }
    })
  }

}

