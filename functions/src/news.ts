

const admin = require('firebase-admin')
const request = require('request')
const cheerio = require('cheerio')
const ngeohash = require('ngeohash')
import * as md5 from 'md5'
import { Detector } from './detector'

export class News {

  /**
   * requestを実行して結果を返す非同期メソッド
   * @param {string} url target url
   * @return {string} HTTP response body
   */
  public static asyncFetch = async(url:string):Promise<string> => {
    return new Promise( resolve => {
      console.log("----> asyncFetch start: "+url)
      request(url, async (error, response, body) => {
          if (error) {
            resolve(null)
          }else{
            switch (response.statusCode) {
              case 200:
                console.log("----> asyncFetch finish")
                resolve(body)
                break
              case 301:
              case 302:
              case 303:
                const newUrl = response.headers('location')
                console.log("----> asyncFetch redirect: "+newUrl)
                // tslint:disable-next-line: no-floating-promises
                resolve(await News.asyncFetch(newUrl))
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
  public static asyncParse = async(html:string):Promise<any> => {
    return new Promise( resolve => {
      console.log("----> asyncParse start")
      let result:any = {}
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
      console.log("----> asyncParse og_title: "+result.og_title)
      console.log("----> asyncParse og_desc: "+result.og_desc)
      console.log("----> asyncParse finish")
      resolve(result)
    })
  }

  /**
   * firestoreのnewsコレクションのデータを更新する非同期メソッド
   * @param {any} data collection document
   */
  public static updateNews = async(data:any) => {
    let update:any = {}
    update.url = data.url
    update.enurl = md5(update.url)
    console.log("updateNews: "+update.url)
    console.log("updateNews: "+update.enurl)

    if (data.og_title===null || data.og_title===undefined){
      const html:any = await News.asyncFetch(update.url)
      if (html===null){
        await admin.firestore().collection('news').doc(update.enurl).update({
          url: update.url,
          redirect: 1
        })
        return
      }
      let web = await News.asyncParse(html)
      update = Object.assign(update, web)
    }else{
      update = Object.assign(update, data)
    }

    if (data.tweets!==undefined && data.tweets.length > 0){
      let tweet_id = data.tweets.sort((a,b)=>{ return (a < b ? 1 : -1); })[0]
      let tweetRef = await admin.firestore().collection('tweets').doc(tweet_id).get()
      let tweet = tweetRef.data()
      if(tweet.tweeted_at instanceof Date){
        update.tweeted_at = tweet.tweeted_at
      }else if (tweet.tweeted_at instanceof String){
        let tweeted_at = new Date(Date.parse(tweet.tweeted_at))
        update.tweeted_at = tweeted_at
      }
    }
    if (update.tweeted_at===undefined){
      update.tweeted_at = null
    }

    // Detector
    let text = update.title+update.og_title+update.og_desc
    const detector = new Detector(text)
    await detector.ready
    update.geohash = ''
    if (detector.location!==undefined && detector.location!==null){
      update.lat = detector.location.lat
      update.long = detector.location.long
      update.geohash = ngeohash.encode(detector.location.lat, detector.location.long)
    }
    if (update.lat===undefined || update.long===undefined){
      update.lat = null
      update.long = null
    }
    
    await admin.firestore().collection('news').doc(update.enurl).update({
      redirect:       0,
      url:            update.url,
      enurl:          update.enurl,
      tweeted_at:     update.tweeted_at,
      title:          update.title,
      og_title:       update.og_title,
      og_desc:        update.og_desc,
      og_image:       update.og_image,
      og_url:         update.og_url,
      geohash:        update.geohash,
      lat:            update.lat,
      long:           update.long,
      category:       detector.category,
      place_country:  detector.country,
      place_pref:     detector.pref,
      place_city:     detector.city,
      place_mountain: detector.mountain,
      place_river:    detector.river,
      place_station:  detector.station,
      place_airport:  detector.airport,
    }).catch((error)=> {
      console.log("----------")
      console.log(error)
      console.log("----------")
    })
  }

  public static updateAllNewsBySnapshot = (docs)=>{
    return new Promise(async (resolve, reject)=>{
      const newSnapshot = await admin.firestore().collection("news")
        .orderBy('url')
        .startAfter(docs)
        .limit(1)
        .get()
      if (newSnapshot.empty) {
        reject('No matching documents!')
      }else{
        const data = newSnapshot.docs[0].data()
        await News.updateNews(data)
        // 再帰
        await News.updateAllNewsBySnapshot(newSnapshot.docs[0])
      }
    })
  }

  public static updateAllNews = async() => {
    return new Promise(async (resolve, reject)=>{
      console.log("----> updateAllNews start: ")
      const snapshot = await admin.firestore().collection("news")
        .orderBy('url')
        .limit(1)
        .get()
      if (snapshot.empty) {
        reject('No matching documents!')
      }else{
        const data = snapshot.docs[0].data()
        await News.updateNews(data)
        await News.updateAllNewsBySnapshot(snapshot.docs[0])
      }
    })
  }
}