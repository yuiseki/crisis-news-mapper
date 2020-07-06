

const admin = require('firebase-admin')
const TwitterClient = require('twitter')

const dotenv = require('dotenv')
dotenv.config()
const a_consumer_key = process.env.A_CONSUMER_KEY
const a_consumer_secret = process.env.A_CONSUMER_SECRET
const a_access_token_key = process.env.A_ACCESS_TOKEN_KEY
const a_access_token_secret = process.env.A_ACCESS_TOKEN_SECRET
const b_consumer_key = process.env.B_CONSUMER_KEY
const b_consumer_secret = process.env.B_CONSUMER_SECRET
const b_access_token_key = process.env.B_ACCESS_TOKEN_KEY
const b_access_token_secret = process.env.B_ACCESS_TOKEN_SECRET



const a_client = new TwitterClient({
  a_consumer_key,
  a_consumer_secret,
  a_access_token_key,
  a_access_token_secret
})
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

//const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

export class Twitter {

  // 最低5秒、最大10秒間隔を開ける
  public crawlTwitter = async (context) => {
    //await sleep(1000 + Math.random() * 1000)
    await this.crawlSelfDefenseTwitter(context)
    //await sleep(5000 + Math.random() * 5000)
    //await this.crawlCrisisWordTwitter(context)
    //await sleep(5000 + Math.random() * 5000)
    //await this.crawlMassMediaTwitter(context)
    //await sleep(5000 + Math.random() * 5000)
    //await this.crawlGovernmentTwitter(context)
  }

  /**
   * 災害に関連するキーワードでTwitterを検索して保存する
   * @param context 
   */
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

  /**
   * 主要マスメディアのドメイン名でTwitterを検索して保存する
   * @param context 
   */
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

  /**
   * 主要行政機関のTwitterアカウントのタイムラインを保存する
   * @param context 
   */
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

  /**
   * 自衛隊のTwitterアカウントのタイムラインを保存する
   * @param context 
   */
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
      place_police:   detector.police,
      lat:            detector.location.lat,
      long:           detector.location.long,
      geohash:        detector.geohash,
      tweeted_at:     new Date(Date.parse(tweet.created_at)),
      updated_at:     admin.firestore.FieldValue.serverTimestamp(),
    }
    // tweet idをキーにして保存する
    await admin.firestore().collection('tweets').doc(tweet.tweet_id_str).set(tweetDoc)
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

  /**
   * Tweetからカテゴリと位置を検出する
   * @param docRef 
   */
  public static detectAsync = async (docRef) => {
    const tweetData = docRef.data()
    console.log('-----> detect: '+tweetData.tweet_id_str)
    const text = tweetData.text
    const detector = new Detector(text)
    await detector.ready
    let tweeted_at = tweetData.tweeted_at
    if (typeof tweetData.tweeted_at === "string"){
      tweeted_at = new Date(Date.parse(tweetData.tweeted_at))
    }
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
      tweeted_at:     tweeted_at,
      updated_at:     admin.firestore.FieldValue.serverTimestamp(),
    }
    await admin.firestore().collection("tweets").doc(tweetData.tweet_id_str)
      .update(tweetDoc)
      .catch((error)=>{
        console.log("----------")
        console.log(error)
        console.log("----------")
      })
    for (const url of tweetData.urls){
      const news = new News(url)
      await news.ready
      await news.setOrUpdateNews(tweetData)
    }
  }

  /**
   * CPUコア数だけ並列実行したい
   */
  public static updateNext = async(startAfterDocRef) => {
    return new Promise(async (resolve, reject)=>{
      if(startAfterDocRef===null || startAfterDocRef===undefined){
        // tslint:disable-next-line: no-parameter-reassignment
        startAfterDocRef = null
      }
      console.log("-----> Twitter.updateNext start: "+startAfterDocRef.id)
      const snapshot = await admin.firestore().collection("tweets")
        .orderBy('tweeted_at', 'desc')
        .startAfter(startAfterDocRef)
        .limit(16)
        .get()
      if (snapshot.empty) {
        reject('No matching documents!')
      }else{
        await Promise.all([
          Twitter.detectAsync(snapshot.docs[0]),
          Twitter.detectAsync(snapshot.docs[1]),
          Twitter.detectAsync(snapshot.docs[2]),
          Twitter.detectAsync(snapshot.docs[3]),
          Twitter.detectAsync(snapshot.docs[4]),
          Twitter.detectAsync(snapshot.docs[5]),
          Twitter.detectAsync(snapshot.docs[6]),
          Twitter.detectAsync(snapshot.docs[7]),
          Twitter.detectAsync(snapshot.docs[8]),
          Twitter.detectAsync(snapshot.docs[9]),
          Twitter.detectAsync(snapshot.docs[10]),
          Twitter.detectAsync(snapshot.docs[11]),
          Twitter.detectAsync(snapshot.docs[12]),
          Twitter.detectAsync(snapshot.docs[13]),
          Twitter.detectAsync(snapshot.docs[14]),
          Twitter.detectAsync(snapshot.docs[15])
        ])
        await Twitter.updateNext(snapshot.docs[15])
      }
    })
  }

  public static startUpdateAll = async(context) => {
    const snapshot = await admin.firestore().collection("tweets")
      .orderBy('tweeted_at', 'desc')
      .limit(1)
      .get()
    await Twitter.detectAsync(snapshot.docs[0])
    await Twitter.updateNext(snapshot.docs[0])
  }

}

