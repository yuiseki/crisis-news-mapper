

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

export class Twitter {
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
    // 海外
    await this.searchTweet('www.bbc.com/japanese')
    // 行政インフラ
    await this.searchTweet('river.go.jp')
    await this.searchTweet('jma.go.jp')
    await this.searchTweet('teideninfo.tepco.co.jp')
    // Web
    await this.searchTweet('news.yahoo.co.jp')
    await this.searchTweet('headlines.yahoo.co.jp')
    // UTF-8じゃない
    //await this.searchTweet('news.livedoor.com')
    await this.searchTweet('times.abema.tv')
    // キーワード
    await this.searchTweet('地震')
    await this.searchTweet('台風')
    await this.searchTweet('浸水')
    await this.searchTweet('氾濫')
    await this.searchTweet('決壊')
    await this.searchTweet('土砂崩れ')
    await this.searchTweet('停電')
    await this.searchTweet('断水')
    await this.searchTweet('給水所')
    await this.searchTweet('避難所')
    await this.searchTweet('通信障害')
  }

  public searchTweet = async (query) => {
    console.log("----> search start : "+query)
    // awaitで検索結果を待つ
    const results:any = await this.searchTweetPromise(query)
    // 検索結果を保存する
    for (const idx in results) {
      const tweet = results[idx];
      // awaitで保存を待つ
      await this.saveTweet(tweet)
    }
  }

  public searchTweetPromise = async (query) => {
    return new Promise((resolve, reject)=>{
      console.log("----> searchTweetPromise start : "+query)
      const params = {q: query, result_type:'populer', count: 100}
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

  public saveTweet = async (tweet) => {
    const urls = []
    for (const idx in tweet.entities.urls){
      const url = tweet.entities.urls[idx].expanded_url
      urls.push(url)
    }
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
    const tweetDoc = {
      tweet_id_str: tweet.id_str,
      user_id_str: tweet.user.id_str,
      is_protected: tweet.user.protected,
      screen_name: tweet.user.screen_name,
      display_name: tweet.user.name,
      icon_url: tweet.user.profile_image_url_https,
      text: tweet.text,
      urls: urls,
      photos: photos,
      videos: video,
      gifs: gif,
      tweeted_at: tweet.created_at,
      rt_count: tweet.retweet_count,
      fav_count: tweet.favorite_count,
      score: tweet.retweet_count + tweet.favorite_count
    }
    // save by tweet id
    await admin.firestore().collection('tweets').doc(tweet.id_str).set(tweetDoc)
    // save by url
    for (const idx in urls){
      const url = urls[idx]
      console.log("----> save: "+url)
      const enurl = md5(url)
      const newsDocRef = await admin.firestore().collection('news').doc(enurl).get()
      if (newsDocRef.exists){
        await admin.firestore().collection('news').doc(enurl).update({
          // MEMO: admin.firestore()だとダメ！！！
          tweets: admin.firestore.FieldValue.arrayUnion(tweet.id_str),
        })
      }else{
        await admin.firestore().collection('news').doc(enurl).set({
          url: url,
          redirect: 0,
          tweets: [tweet.id_str],
          title: null,
          og_title: null,
          og_desc: null,
          og_image: null,
          og_url : null,
          place_country: null,
          place_area: null,
          place_state: null,
          place_pref: null,
          place_city: null,
          place_mountain: null,
          place_river: null,
          place_station: null,
          place_airport: null,
          geohash: null
        })
      }
    }
  }
}

