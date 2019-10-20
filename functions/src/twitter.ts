
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const TwitterClient = require('twitter')

const a_consumer_key = functions.config().twitter.a_consumer_key
const a_consumer_secret = functions.config().twitter.a_consumer_secret
const a_access_token_key = functions.config().twitter.a_access_token_key
const a_access_token_secret = functions.config().twitter.a_access_token_secret
const a_client = new TwitterClient({
  a_consumer_key,
  a_consumer_secret,
  a_access_token_key,
  a_access_token_secret
})
const b_consumer_key = functions.config().twitter.b_consumer_key
const b_consumer_secret = functions.config().twitter.b_consumer_secret
const b_access_token_key = functions.config().twitter.b_access_token_key
const b_access_token_secret = functions.config().twitter.b_access_token_secret
const b_client = new TwitterClient({
  b_consumer_key,
  b_consumer_secret,
  b_access_token_key,
  b_access_token_secret
})

const categoryList = require('../data/yuiseki.net/detector_category_words.json')
const selfDefenseList = require('../data/yuiseki.net/self_defense.json')
const governmentList = require('../data/yuiseki.net/government_japan.json')
const massMediaList = require('../data/yuiseki.net/mass_media_japan.json')

import { News } from './news'
import { Detector } from './detector'

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

export class Twitter {

  public crawlTwitter = async (context) => {
    // 最低5秒、最大10秒間隔を開ける
    await sleep(5000 + Math.random() * 5000)
    await this.crawlCrisisWordTwitter(context)
    await sleep(5000 + Math.random() * 5000)
    await this.crawlMassMediaTwitter(context)
    await sleep(5000 + Math.random() * 5000)
    await this.crawlGovernmentTwitter(context)
    await sleep(5000 + Math.random() * 5000)
    await this.crawlSelfDefenseTwitter(context)
  }

  public crawlCrisisWordTwitter = async (context) => {
    console.log("----> crawlCrisisWordTwitter start")
    const now = new Date()
    let query
    if (categoryList.crisis.length > now.getMinutes()+1){
      query = categoryList.crisis[now.getMinutes()]
      console.log("----> crawlCrisisWordTwitter query: "+query)
      await this.searchTweetsAndSaveAsync(query)
    }
    console.log("----> crawlCrisisWordTwitter finish")
  }

  public crawlMassMediaTwitter = async (context) => {
    console.log("----> crawlMassMediaTwitter start")
    const now = new Date()
    let query
    if (massMediaList.length > now.getMinutes()+1){
      query = massMediaList[now.getMinutes()].query
      console.log("----> crawlMassMediaTwitter query: "+query)
      await this.searchTweetsAndSaveAsync(query)
    }
    console.log("----> crawlMassMediaTwitter finish")
  }

  public crawlGovernmentTwitter = async (context) => {
    console.log("----> crawlGovernmentTwitter start")
    const now = new Date()
    let screen_name
    if (governmentList.length > now.getMinutes()+1){
      screen_name = governmentList[now.getMinutes()].twitter
      console.log("----> crawlGovernmentTwitter screen_name: "+screen_name)
      await this.getTimelineAndSaveAsync(screen_name)
    }
    console.log("----> crawlGovernmentTwitter finish")
  }

  public crawlSelfDefenseTwitter = async (context) => {
    console.log("----> crawlSelfDefenseTwitter start")
    const now = new Date()
    let screen_name
    if (selfDefenseList.length > now.getMinutes()+1){
      if (selfDefenseList[now.getMinutes()].twitter!==null){
        screen_name = selfDefenseList[now.getMinutes()].twitter
      console.log("----> crawlSelfDefenseTwitter screen_name: "+screen_name)
        await this.getTimelineAndSaveAsync(screen_name)
      }
    }
    console.log("----> crawlSelfDefenseTwitter finish")
  }


  /**
   * Twitterを検索してその結果をfirestoreに保存する非同期メソッド
   * @param {string} query 検索クエリ文字列
   */
  public searchTweetsAndSaveAsync = async (query) => {
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
      console.log("----> searchTweetsAsync start : "+query)
      const params = {q: query+" exclude:retweets", result_type:'recent', count: 100}
      const now = new Date()
      let client
      if(now.getMinutes() % 2 === 0){
        client = a_client
      }else{
        client = b_client
      }
      client.get('search/tweets', params, (error, results, response) => {
        if (error){
          console.log("error: "+JSON.stringify(error))
          reject(error)
        }else{
          console.log("----> searchTweetsAsync finish : "+query)
          resolve(results.statuses)
        }
      })
    })
  }

  /**
   * Twitterを検索してその結果をfirestoreに保存する非同期メソッド
   * @param {string} screen_name 検索クエリ文字列
   */
  public getTimelineAndSaveAsync = async (screen_name) => {
    console.log("----> getTimelineAndSave start: "+screen_name)
    const results:any = await this.getTimelineAsync(screen_name)
    for (const tweet of results) {
      await this.saveTweetAsync(tweet)
    }
    console.log("----> getTimelineAndSave finish: "+screen_name)
  }

  /**
   * TwitterのタイムラインAPIを呼び結果を返す非同期メソッド
   * @param {string} screen_name Twitter screen name
   * @return {tweets[]} 検索結果
   */
  public getTimelineAsync = async (screen_name) => {
    return new Promise((resolve, reject)=>{
      console.log("----> getTimelineAsync start : "+screen_name)
      const params = {
        screen_name: screen_name,
        exclude_replies: true,
        include_rts: false,
        count: 200
      }
      const now = new Date()
      let client
      if(now.getMinutes() % 2 === 0){
        client = a_client
      }else{
        client = b_client
      }
      client.get('statuses/user_timeline', params, (error, results, response) => {
        if (error){
          console.log("error: "+JSON.stringify(error))
          reject(error)
        }else{
          console.log("----> getTimelineAsync finish : "+screen_name)
          resolve(results)
        }
      })
    })
  }

  /**
   * firestoreのtweetコレクションにtweetを保存する非同期メソッド
   * @param {tweet} tweet
   */
  public saveTweetAsync = async (tweet) => {
    if (tweet===undefined || tweet === null){
      return
    }
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

