

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

//const categoryList = require('../data/yuiseki.net/detector_category_words.json')
const selfDefenseList = require('../data/yuiseki.net/self_defense.json')
//const governmentList = require('../data/yuiseki.net/government_japan.json')
const massMediaList = require('../data/yuiseki.net/mass_media_japan.json')

import { News } from './news'
import { Detector } from './detector'

export class Twitter {

  public crawlSelfDefenseTwitter = async (context) => {
    console.log("----> crawlSelfDefenseTwitter start")
    const now = new Date()
    let query
    if (selfDefenseList.length > now.getMinutes()+1){
      if (selfDefenseList[now.getMinutes()].twitter!==null){
        query = selfDefenseList[now.getMinutes()].twitter
        await this.searchTweetsAndSave("from:"+query)
      }
    }
    console.log("----> crawlSelfDefenseTwitter finish")
  }

  /**
   * twitterの検索を実行する非同期メソッド
   * functionsは最大540秒でタイムアウトしてしまう
   * 毎分実行し、毎分ちがうqueryで検索する
   */
  public crawlMassMediaTwitter = async (context) => {
    console.log("----> crawlSearchTwitter start")
    const now = new Date()
    let query
    if (massMediaList.length > now.getMinutes()+1){
      query = massMediaList[now.getMinutes()].query
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
    if(selfDefenseList.includes(tweet.user.screen_name)){
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
        await news.updateByLastTweet(tweet)
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

