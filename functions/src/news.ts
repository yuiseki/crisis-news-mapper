
const admin = require('firebase-admin')
const request = require('request')
const cheerio = require('cheerio')
import * as md5 from 'md5'
import { Detector } from './detector'

const massMediaList = require('../data/yuiseki.net/mass_media_japan.json')

export class News {
  ready:Promise<any>
  url:string
  enurl:string
  exists:boolean
  data:any
  html:string
  web:any

  /**
   * requestを実行して結果を返す非同期メソッド
   * @param {string} url target url
   * @return {string} HTTP response body
   */
  public static fetchAsync = async(url:string):Promise<string> => {
    const opts = {
      url: url,
      timeout: 2000
    }
    return new Promise( resolve => {
      request(opts, async (error, response, body) => {
          if (error) {
            resolve(null)
          }else{
            switch (response.statusCode) {
              case 200:
                resolve(body)
                break
              case 301:
              case 302:
              case 303:
                const newUrl = response.headers('location')
                console.log("----> fetchAsync redirect: "+newUrl)
                // tslint:disable-next-line: no-floating-promises
                resolve(await News.fetchAsync(newUrl))
                break
              case 404:
                resolve(null)
                break
              default:
                resolve(null)
            }
          }
      })
    })
  }

  /**
   * HTMLの本文を解析する非同期メソッド
   * @param {string} html html content body string
   * @return {any} 解析結果
   */
  public static parseAsync = async(html:string):Promise<any> => {
    return new Promise( resolve => {
      const result:any = {
        title: null,
        og_title: null,
        og_desc: null,
        og_image: null,
        og_url: null,
      }
      try{
        const document = cheerio.load(html)
        result.title = cheerio.text(document('title'))
        if (result.title===undefined){
          result.title = null
        }
        result.og_title = document("meta[property='og:title']").attr('content')
        if (result.og_title===undefined){
          result.og_title = null
        }
        result.og_desc  = document("meta[property='og:description']").attr('content')
        if (result.og_desc===undefined){
          result.og_desc = null
        }
        result.og_image = document("meta[property='og:image']").attr('content')
        if (result.og_image===undefined){
          result.og_image = null
        }
        result.og_url   = document("meta[property='og:url']").attr('content')
        if (result.og_url===undefined){
          result.og_url = null
        }
        resolve(result)
      }catch(e){
        resolve(result)
      }
      
    })
  }

  /**
   * コンストラクタ
   * @param {string} url 追加/更新したいニュース記事のURL
   */
  constructor(url:string){
    this.url = url
    this.enurl = md5(url)
    this.ready = new Promise(async (resolve, reject) => {
      let firestoreIsOnline = true
      let shouldFetch = true
      try{
        admin.firestore()
      }catch(e){
        // firestoreがオフラインのときはnews docがないものとして扱う
        firestoreIsOnline = false
        this.exists = false
        this.data = {}
        shouldFetch = true
      }
      if(firestoreIsOnline){
        const docRef = await admin.firestore().collection('news').doc(this.enurl).get()
        if(docRef.exists){
          // firestoreにすでにnews docが存在する
          this.exists = true
          this.data = docRef.data()
          // スクレイピング済みか？
          if (this.data.og_title===null || this.data.og_title===undefined){
            shouldFetch = true
          }else{
            this.web = {
              title: this.data.title,
              og_title: this.data.og_title,
              og_desc: this.data.og_desc,
              og_image: this.data.og_image,
              og_url: this.data.og_url,
            }
          }
        }else{
          // firestoreにまだnews docが存在しない
          this.exists = false
          this.data = {}
          shouldFetch = true
        }
      }
      if (shouldFetch){
        this.html = await News.fetchAsync(this.url)
        if (firestoreIsOnline && this.html===null){
          await admin.firestore().collection('news').doc(this.enurl).update({
            url: this.url,
            redirect: 1
          }).catch((error)=> {
            console.log("----------")
            console.log(error)
            console.log("----------")
          })
        }
        this.web = await News.parseAsync(this.html)
      }
      resolve()
    })
  }

  /**
   * ニュース記事の最新ツイート日時を得る非同期メソッド
   * @return {Date} 最新ツイート日時
   */
  public getTweetedAtAsync = async() => {
    let tweeted_at
    if (this.exists && this.data.tweets!==undefined && this.data.tweets.length > 0){
      // newsDoc.tweetsを降順でソートして最新のtweet_idを得る
      const tweet_id = this.data.tweets.sort((a,b)=>{ return (a < b ? 1 : -1); })[0]
      // tweetDocを得る
      const tweetRef = await admin.firestore().collection('tweets').doc(tweet_id).get()
      if(tweetRef.exists){
        const tweet = tweetRef.data()
        if (typeof tweet.tweeted_at === "string"){
          tweeted_at = new Date(Date.parse(tweet.tweeted_at))
        }else{
          tweeted_at = tweet.tweeted_at
        }
      }else{
        tweeted_at = null
      }
    }
    if(tweeted_at===undefined){
      tweeted_at = null
    }
    return tweeted_at
  }

  /**
   * ニュース記事の本文をDetectorにかける非同期メソッド
   * @return {Detector} Detector
   */
  public getDetectorAsync = async() => {
    // ニュース本文のテキスト分析
    const text = this.web.title+this.web.og_title+this.web.og_desc
    const detector = new Detector(text)
    await detector.ready
    return detector
  }

  /**
   * firestoreのnewsコレクションに追加するObjectを構築する非同期メソッド
   * @return {any} newsコレクションに追加できるObject
   */
  public getNewsDocParamAsync = async () => {
    let newData:any = {}
    newData.url = this.url
    newData.enurl = md5(this.url)
    newData.updated_at = new Date()

    newData = Object.assign(newData, this.web)

    if(this.data.tweets instanceof Array){
      newData.tweets = this.data.tweets
    }else{
      newData.tweets = []
    }
    newData.tweeted_at = await this.getTweetedAtAsync()

    const detector = await this.getDetectorAsync()
    const detectorData = {
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
    }
    newData = Object.assign(newData, detectorData)
    if(newData.category===undefined){
      newData.category = null
    }
    if(newData.place_country===undefined){
      newData.place_country = null
    }
    if(newData.place_pref===undefined){
      newData.place_pref = null
    }
    if(newData.place_city===undefined){
      newData.place_city = null
    }
    if(newData.place_river===undefined){
      newData.place_river = null
    }
    if(newData.place_mountain===undefined){
      newData.place_mountain = null
    }
    if(newData.place_station===undefined){
      newData.place_station = null
    }
    if(newData.place_airport===undefined){
      newData.place_airport = null
    }
    if(newData.place_police===undefined){
      newData.place_police = null
    }
    return newData
  }

  /**
   * tweetによって言及された最終日時を更新する
   * @param tweet 
   */
  public updateByLastTweet = async(tweet) => {
    // 最終言及日時を更新
    let tweeted_at
    if(typeof tweet.tweeted_at === "string"){
      tweeted_at =  new Date(Date.parse(tweet.tweeted_at))
    }else{
      tweeted_at = tweet.tweeted_at
    }
    await admin.firestore().collection('news').doc(this.enurl).update({
      // MEMO: admin.firestore()だとダメ！！！
      // 言及ツイートに追加
      tweets: admin.firestore.FieldValue.arrayUnion(tweet.tweet_id_str),
      tweeted_at: tweeted_at
    }).catch((error)=> {
      console.log("----------")
      console.log(error)
      console.log("----------")
    })
  }

  /**
   * ニュース記事をfirestoreのnewsコレクションに追加/更新する非同期メソッド
   */
  public setOrUpdateNews = async(tweet) => {
    const param = await this.getNewsDocParamAsync()
    if (this.exists){
      await admin.firestore().collection('news').doc(this.enurl)
        .update(param)
        .catch((error) => {
          console.log("----------")
          console.log(error)
          console.log("----------")
        })
    }else{
      if(tweet!==null){
        if(param.tweets!==undefined || param.tweets!==null || param.tweets.length===0){
          param.tweets = [tweet.tweet_id_str]
        }
        if (typeof tweet.tweeted_at === "string"){
          param.tweeted_at = new Date(Date.parse(tweet.tweeted_at))
        }else{
          param.tweeted_at = tweet.tweeted_at
        }
      }else{
        param.tweets = []
        param.tweeted_at = null
      }
      param.created_at = new Date()
      await admin.firestore().collection('news').doc(this.enurl)
        .set(param)
        .catch((error) => {
          console.log("----------")
          console.log(error)
          console.log("----------")
        })
    }
  }

  public static updateAsync = async(docRef) => {
    const newsData = docRef.data()
    if(newsData.title===null || newsData.og_title===null || newsData.og_desc===null){
      const html = await News.fetchAsync(newsData.url)
      if(html===null){
        return
      }
      const web = await News.parseAsync(html)
      newsData.title = web.title
      newsData.og_title = web.og_title
      newsData.og_desc = web.og_desc
      newsData.og_url = web.og_url
      newsData.og_image = web.og_image
    }
    const text = newsData.title+newsData.og_title+newsData.og_desc
    const detector = new Detector(text)
    await detector.ready
    newsData.category = detector.category
    newsData.place_country = detector.country
    newsData.place_pref = detector.pref
    newsData.place_city = detector.city
    newsData.place_station = detector.station
    newsData.place_airport = detector.airport
    newsData.place_police = detector.police
    newsData.lat = detector.location.lat
    newsData.long = detector.location.long
    newsData.geohash = detector.geohash
    newsData.updated_at = admin.firestore.FieldValue.serverTimestamp()
    const tweeted_at = newsData.tweeted_at
    if (typeof tweeted_at === "string"){
      // @ts-ignore
      newsData.tweeted_at = new Date(Date.parse(tweeted_at))
    }
    if(newsData.url.startsWith('https://twitter.com/')){
      newsData.classification = "twitter"
      newsData.category = "twitter"
    }
    for(const massMedia of massMediaList){
      if(newsData.url.startsWith(massMedia.url)){
        newsData.classification = "massmedia"
      }
    }
    await admin.firestore().collection("news").doc(docRef.id)
      .update(newsData).catch((error)=>{
        console.log("----------")
        console.log(error)
        console.log("----------")
      })
  }


  /**
   * まだDetectorでカテゴリ・位置を検出していない
   * ニュース記事すべてを処理するための非同期メソッド
   */
  public static startUpdateAll = async(context) => {
    const snapshot = await admin.firestore().collection("news")
      .where('category', '==', null)
      .orderBy('tweeted_at', 'desc')
      .limit(1)
      .get()
    await News.updateAsync(snapshot.docs[0])
    await News.updateAll(snapshot.docs[0])
  }

  /**
   * startAfterであとに続くドキュメントを取り出すことができるので
   * 再帰的に呼び出すことで全件処理になる
   */
  public static updateAll = async(startAfterDocRef) => {
    return new Promise(async (resolve, reject)=>{
      if(startAfterDocRef===null || startAfterDocRef===undefined){
        // tslint:disable-next-line: no-parameter-reassignment
        return
      }
      const snapshot = await admin.firestore().collection("news")
        .where('category', '==', null)
        .orderBy('tweeted_at', 'desc')
        .startAfter(startAfterDocRef)
        .limit(4)
        .get()
      if (snapshot.empty) {
        reject('No matching documents!')
      }else{
        await Promise.all([
          News.updateAsync(snapshot.docs[0]),
          News.updateAsync(snapshot.docs[1]),
          News.updateAsync(snapshot.docs[2]),
          News.updateAsync(snapshot.docs[3])
        ])
        await News.updateAll(snapshot.docs[3])
      }
    })
  }


  /**
   * カテゴリが不明だったニュース記事すべてを
   * もう一回Detectorで検出するための非同期メソッド
   */
  public static startReindexCategory = async(context) => {
    const snapshot = await admin.firestore().collection("news")
      .where('category', '==', 'unknown')
      .orderBy('tweeted_at', 'desc')
      .limit(1)
      .get()
    await News.updateAsync(snapshot.docs[0])
    await News.reindexCategory(snapshot.docs[0])
  }

  public static reindexCategory = async(startAfterDocRef) => {
    return new Promise(async (resolve, reject)=>{
      if(startAfterDocRef===null || startAfterDocRef===undefined){
        return
      }
      console.log("-----> News.reindexUnknown: "+startAfterDocRef.id)
      const snapshot = await admin.firestore().collection("news")
        .where('category', '==', 'unknown')
        .orderBy('tweeted_at', 'desc')
        .startAfter(startAfterDocRef)
        .limit(1)
        .get()
      if (snapshot.empty) {
        reject('No matching documents!')
      }else{
        await News.updateAsync(snapshot.docs[0])
        await News.reindexCategory(snapshot.docs[0])
      }
    })
  }

  /**
   * 位置が不明だったニュース記事すべてを
   * もう一度Detectorで検出しなおすための非同期メソッド
   */
  public static startReindexLocation = async(context) => {
    const snapshot = await admin.firestore().collection("news")
      .where('place_country', '==', null)
      .orderBy('tweeted_at', 'desc')
      .limit(1)
      .get()
    await News.updateAsync(snapshot.docs[0])
    await News.reindexLocation(snapshot.docs[0])
  }

  public static reindexLocation = async(startAfterDocRef) => {
    return new Promise(async (resolve, reject)=>{
      if(startAfterDocRef===null || startAfterDocRef===undefined){
        return
      }
      const snapshot = await admin.firestore().collection("news")
        .where('place_country', '==', null)
        .orderBy('tweeted_at', 'desc')
        .startAfter(startAfterDocRef)
        .limit(1)
        .get()
      if (snapshot.empty) {
        reject('No matching documents!')
      }else{
        await News.updateAsync(snapshot.docs[0])
        await News.reindexLocation(snapshot.docs[0])
      }
    })
  }

}