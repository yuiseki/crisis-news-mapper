
const admin = require('firebase-admin')
const request = require('request')
const cheerio = require('cheerio')
import * as md5 from 'md5'
import { Detector } from './detector'

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
    return new Promise( resolve => {
      console.log("----> fetchAsync start: "+url)
      request(url, async (error, response, body) => {
          if (error) {
            resolve(null)
          }else{
            switch (response.statusCode) {
              case 200:
                console.log("----> fetchAsync finish")
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
      console.log("----> parseAsync start")
      const result:any = {}
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
      console.log("----> parseAsync og_title: "+result.og_title)
      console.log("----> parseAsync og_desc: "+result.og_desc)
      console.log("----> parseAsync finish")
      resolve(result)
    })
  }

  /**
   * コンストラクタ
   * @param {string} url 追加/更新したいニュース記事のURL
   */
  constructor(url:string){
    this.url = url
    this.enurl = md5(url)
    this.ready = new Promise(async resolve => {
      // firestoreにすでにnews docが存在するか？
      const docRef = await admin.firestore().collection('news').doc(this.enurl).get()
      let shouldFetch
      if (docRef.exists){
        this.exists = true
        this.data = docRef.data()
        if (this.data.og_title===null || this.data.og_title===undefined){
          shouldFetch = true
        }
      }else {
        this.exists = false
        this.data = {}
        shouldFetch = true
      }
      if (shouldFetch){
        this.html = await News.fetchAsync(this.url)
        if (this.html===null){
          await admin.firestore().collection('news').doc(this.enurl).update({
            url: this.url,
            redirect: 1
          })
        }
        this.web = await News.parseAsync(this.html)
      }else {
        this.html = null
        this.web = {
          title: this.data.title,
          og_title: this.data.og_title,
          og_desc: this.data.og_desc,
          og_image: this.data.og_image,
          og_url: this.data.og_url,
        }
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
        tweeted_at = tweet.tweeted_at
        if (tweet.tweeted_at instanceof String){
          tweeted_at = new Date(Date.parse(tweet.tweeted_at))
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

    newData.tweets = this.data.tweets
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
      lat:            detector.location.lat,
      long:           detector.location.long,
      geohash:        detector.geohash,
    }
    const param = Object.assign(newData, detectorData)
    return param
  }

  public updateByLastTweet = async(tweet) => {
    const enurl = md5(tweet.url)
    await admin.firestore().collection('news').doc(enurl).update({
      // MEMO: admin.firestore()だとダメ！！！
      // 言及ツイートに追加
      tweets: admin.firestore.FieldValue.arrayUnion(tweet.id_str),
      // 最終言及日時を更新
      tweeted_at: new Date(Date.parse(tweet.created_at)),
    })
  }

  /**
   * ニュース記事をfirestoreのnewsコレクションに追加/更新する非同期メソッド
   */
  public setOrUpdateNews = async(tweet) => {
    console.log("setOrUpdateNews: "+this.url)
    console.log("setOrUpdateNews: "+this.enurl)
    const param = await this.getNewsDocParamAsync()
    if (this.exists){
      await admin.firestore().collection('news').doc(this.enurl).update(param)
        .catch((error)=> {
          console.log("----------")
          console.log(error)
          console.log("----------")
        })
    }else{
      if(tweet!==null){
        param.tweets = [tweet.id_str]
        param.tweeted_at = new Date(Date.parse(tweet.created_at))
      }
      await admin.firestore().collection('news').doc(this.enurl).set(param)
        .catch((error)=> {
          console.log("----------")
          console.log(error)
          console.log("----------")
        })
    }
  }

  public static updateAllNewsByDocRef = (docRef)=>{
    return new Promise(async (resolve, reject)=>{
      const newsSnapshot = await admin.firestore().collection("news")
        .orderBy('updated_at', 'desc')
        .startAfter(docRef)
        .limit(1)
        .get()
      if (newsSnapshot.empty) {
        reject('No matching documents!')
      }else{
        const data = newsSnapshot.docs[0].data()
        const news = new News(data.url)
        await news.ready
        await news.setOrUpdateNews(null)
        // 再帰
        await News.updateAllNewsByDocRef(newsSnapshot.docs[0])
      }
    })
  }

  public static updateAllNews = async() => {
    return new Promise(async (resolve, reject)=>{
      console.log("----> updateAllNews start: ")
      const now = new Date()
      const tenMinutesAgo = new Date(now.getTime() - 60 * 10)
      const newsSnapshot = await admin.firestore().collection("news")
        .orderBy('updated_at', 'desc')
        .startAfter(tenMinutesAgo)
        .limit(1)
        .get()
      if (newsSnapshot.empty) {
        reject('No matching documents!')
      }else{
        const data = newsSnapshot.docs[0].data()
        const news = new News(data.url)
        await news.ready
        await news.setOrUpdateNews(null)
        await News.updateAllNewsByDocRef(newsSnapshot.docs[0])
      }
    })
  }
}