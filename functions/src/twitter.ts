

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

  /**
   * twitterの検索をまとめて実行する非同期メソッド
   */
  public crawlTwitter = async (context)=>{
    console.log("----> crawlTwitter start")
    // 新聞
    await this.searchTweet('yomiuri.co.jp')
    await this.searchTweet('mainichi.jp')
    await this.searchTweet('asahi.com')
    await this.searchTweet('sankei.com')
    await this.searchTweet('nikkei.com')
    // TV
    await this.searchTweet('nhk.or.jp')
    await this.searchTweet('news24.jp')
    await this.searchTweet('news.tbs.co.jp')
    await this.searchTweet('fnn.jp')
    await this.searchTweet('news.tv-asahi.co.jp')
    // 通信社
    await this.searchTweet('this.kiji.is')
    await this.searchTweet('47news')
    await this.searchTweet('jiji.com')
    await this.searchTweet('www.afpbb.com')
    // Web ニュース
    await this.searchTweet('news.yahoo.co.jp')
    await this.searchTweet('headlines.yahoo.co.jp')
    await this.searchTweet('times.abema.tv')
    // UTF-8じゃない
    //await this.searchTweet('news.livedoor.com')
    // 海外 ニュース
    await this.searchTweet('www.bbc.com/japanese')
    // 行政インフラ
    // 内閣府
    await this.searchTweet('cao.go.jp')
    // 内閣府 防災情報
    await this.searchTweet('bousai.go.jp')
    // 首相官邸
    await this.searchTweet('kantei.go.jp')
    // 防衛省 自衛隊
    await this.searchTweet('mod.go.jp')
    // 気象庁
    await this.searchTweet('jma.go.jp')
    // 国土交通省
    await this.searchTweet('mlit.go.jp')
    // 国土交通省 川の防災情報
    await this.searchTweet('river.go.jp')
    // 総務省 消防庁
    await this.searchTweet('fdma.go.jp')
    // 厚生労働省
    await this.searchTweet('mhlw.go.jp')
    // 経済産業省
    await this.searchTweet('meti.go.jp')
    // 東京電力
    await this.searchTweet('tepco.co.jp')
    // キーワード
    await this.searchTweet('災害')
    await this.searchTweet('被災')
    await this.searchTweet('地震')
    await this.searchTweet('台風')
    // 水
    await this.searchTweet('洪水')
    await this.searchTweet('浸水')
    await this.searchTweet('冠水')
    await this.searchTweet('氾濫')
    await this.searchTweet('決壊')
    // 山
    await this.searchTweet('崖崩れ')
    await this.searchTweet('土砂')
    // ライフライン
    await this.searchTweet('停電')
    await this.searchTweet('断水')
    await this.searchTweet('給水')
    await this.searchTweet('通信障害')
  }

  /**
   * Twitterを検索してその結果をfirestoreに保存する非同期メソッド
   * @param {string} query 検索クエリ文字列
   */
  public searchTweet = async (query) => {
    console.log("----> search start : "+query)
    // awaitで検索結果を待つ
    const results:any = await this.searchTweetAsync(query)
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
  public searchTweetAsync = async (query) => {
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
        // 全部空の状態で追加する
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
          lat:            null,
          long:           null,
          geohash:        null,
          category:       null,
          place_country:  null,
          place_pref:     null,
          place_city:     null,
          place_mountain: null,
          place_river:    null,
          place_station:  null,
          place_airport:  null,
        })
      }
      if(url!==undefined && url!==null){
        // ニュース本文の分析を実行する
        const dataRef = await admin.firestore().collection('news').doc(enurl).get()
        if(dataRef.exists){
          await News.updateNews(dataRef.data())
        }
      }
    }
  }
}

