

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

import * as md5 from 'md5';
import { News } from './news'

export class Twitter {

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
    // 行政インフラ 11
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
    // 国土交通省 川の防災情報
    'river.go.jp',
    // 総務省 消防庁
    'fdma.go.jp',
    // 厚生労働省
    'mhlw.go.jp',
    // 経済産業省
    'meti.go.jp',
    // 東京電力
    'tepco.co.jp',
    // キーワード 4
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

  /**
   * twitterの検索を実行する非同期メソッド
   * functionsは最大540秒でタイムアウトしてしまう
   * 毎分実行し、毎分ちがうqueryで検索する
   */
  public crawlTwitter = async (context) => {
    console.log("----> crawlTwitter start")
    const now = new Date()
    let query
    if (Twitter.queryList.length > now.getMinutes()+1){
      query = Twitter.queryList[now.getMinutes()]
    }
    await this.searchTweetsAndSave(query)
    console.log("----> crawlTwitter finish")
  }

  /**
   * Twitterを検索してその結果をfirestoreに保存する非同期メソッド
   * @param {string} query 検索クエリ文字列
   */
  public searchTweetsAndSave = async (query) => {
    console.log("----> search start : "+query)
    // awaitで検索結果を待つ
    const results:any = await this.searchTweetsAsync(query)
    // 検索結果を保存する
    for (const tweet of results) {
      // awaitで保存を待つ
      await this.saveTweetAsync(tweet)
    }
  }

  /**
   * Twitterの検索APIを呼び検索結果を返す非同期メソッド
   * @param {string} query 検索クエリ文字列
   * @return {tweets[]} 検索結果
   */
  public searchTweetsAsync = async (query) => {
    return new Promise((resolve, reject)=>{
      console.log("----> searchTweetPromise start : "+query)
      const params = {q: query, result_type:'recent', count: 100}
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
    let gif = null
    for (const idx in tweet.entities.media){
      switch(tweet.entities.media[idx].type){
        case "photo":
          photos.push(tweet.entities.media[idx].media_url_https)
          break
        case "video":
          video = tweet.entities.media[idx].media_url_https
          break
        case "animated_gif":
          gif = tweet.entities.media[idx].media_url_https
          break
      }
    }
    // firestoreに保存するdocument objectを組み立てる
    const tweetDoc = {
      tweet_id_str: tweet.id_str,
      user_id_str:  tweet.user.id_str,
      is_protected: tweet.user.protected,
      screen_name:  tweet.user.screen_name,
      display_name: tweet.user.name,
      icon_url:     tweet.user.profile_image_url_https,
      text:         tweet.text,
      urls:         urls,
      photos:       photos,
      videos:       video,
      gifs:         gif,
      tweeted_at:   new Date(Date.parse(tweet.created_at)),
      rt_count:     tweet.retweet_count,
      fav_count:    tweet.favorite_count,
      score:        tweet.retweet_count + tweet.favorite_count,
      updated_at:   admin.firestore.FieldValue.serverTimestamp(),
    }
    // tweet idをキーにして保存する
    await admin.firestore().collection('tweets').doc(tweet.id_str).set(tweetDoc)
    // newsコレクションも更新する
    for (const url of urls){
      // urlのmd5 hashをキーにしてnewsドキュメントが存在するかチェックする
      const enurl = md5(url)
      const newsDocRef = await admin.firestore().collection('news').doc(enurl).get()
      if (newsDocRef.exists){
        // すでに存在している場合
        await admin.firestore().collection('news').doc(enurl).update({
          // MEMO: admin.firestore()だとダメ！！！
          // 言及ツイートに追加
          tweets: admin.firestore.FieldValue.arrayUnion(tweet.id_str),
          // 最終言及日時を更新
          tweeted_at: new Date(Date.parse(tweet.created_at)),
        })
      }else{
        // 存在していない場合
        // 全部nullの状態で追加する
        // nullにしておかないとあとでfirestoreで検索できない
        await admin.firestore().collection('news').doc(enurl).set({
          redirect:       0,
          url:            url,
          enurl:          enurl,
          tweets:         [tweet.id_str],
          tweeted_at:     new Date(Date.parse(tweet.created_at)),
          title:          null,
          og_title:       null,
          og_desc:        null,
          og_image:       null,
          og_url:         null,
          category:       null,
          place_country:  null,
          place_pref:     null,
          place_city:     null,
          place_river:    null,
          place_mountain: null,
          place_station:  null,
          place_airport:  null,
          lat:            null,
          long:           null,
          geohash:        null,
        })
      }
      if(url!==undefined && url!==null){
        // ニュース本文の分析を実行する
        const dataRef = await admin.firestore().collection('news').doc(enurl).get()
        if(dataRef.exists){
          const data = dataRef.data()
          const news = new News(data.url)
          await news.ready
          await news.setOrUpdateNews()
        }
      }
    }
  }
}

