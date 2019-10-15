

const admin = require('firebase-admin')
const request = require('request')
const cheerio = require('cheerio')
const ngeohash = require('ngeohash')
import * as md5 from 'md5'
import { Mapper } from './mapper'

export class News {

  /**
   * 非同期でrequestを実行するメソッド
   * @param string target url
   * @return string HTTP response body
   */
  public static asyncFetch = async(url:string):Promise<string> => {
    return new Promise((resolve, reject) => {
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
   * 非同期でHTMLのparseをするメソッド
   */
  public static asyncParse = async(html:string):Promise<any> => {
    return new Promise((resolve, reject)=>{
      console.log("----> asyncParse start")
      const document = cheerio.load(html)
      const title = cheerio.text(document('title'))
      console.log("----> asyncParse title : "+title)
      let og_title = document("meta[property='og:title']").attr('content')
      if (og_title === undefined){
        og_title = null
      }
      console.log("----> asyncParse og_title : "+og_title)
      let og_desc  = document("meta[property='og:description']").attr('content')
      if (og_desc === undefined){
        og_desc = null
      }
      console.log("----> asyncParse og_desc : "+og_desc)
      let og_image = document("meta[property='og:image']").attr('content')
      if (og_image === undefined){
        og_image = null
      }
      let og_url   = document("meta[property='og:url']").attr('content')
      if (og_url === undefined){
        og_url = null
      }
      const result = {
        title: title,
        og_title: og_title,
        og_desc: og_desc,
        og_image: og_image,
        og_url : og_url,
      }
      console.log("----> parse finish")
      resolve(result)
    })
  }



  public updateNews = async(data) => {
    const url = data.url
    console.log("----> updateNews: "+url)
    const enurl = md5(url)

    let title
    let og_title
    let og_desc
    let og_image
    let og_url
    let text
    if (data.og_title===null || data.og_title===undefined){
      const html:any = await News.asyncFetch(url)
      if (html===null){
        await admin.firestore().collection('news').doc(enurl).update({
          url: url,
          redirect: 1
        })
        return
      }
      const web:any = await News.asyncParse(html)
      title = web.title
      og_title = web.title
      og_desc = web.og_desc
      og_image = web.og_image
      og_url = web.og_url
      text = web.title+web.og_title+web.og_desc
    }else{
      title = data.title
      og_title = data.title
      og_desc = data.og_desc
      og_image = data.og_image
      og_url = data.og_url
      text = data.title+data.og_title+data.og_desc
    }
    
    const mapper = new Mapper(text)

    let news_geohash = null
    let lat = null
    let long = null
    if (mapper.location!==undefined && mapper.location!==null){
      lat = mapper.location.lat
      long = mapper.location.long
      news_geohash = ngeohash.encode(mapper.location.lat, mapper.location.long)
    }else{
      news_geohash = ''
    }
    
    await admin.firestore().collection('news').doc(enurl).update({
      url:           url,
      redirect:      0,
      title:         title,
      og_title:      og_title,
      og_desc:       og_desc,
      og_image:      og_image,
      og_url:        og_url,
      place_country: mapper.country,
      place_area:    null,
      place_state:   null,
      place_pref:    mapper.pref,
      place_city:    mapper.city,
      place_mountain: mapper.mountain,
      place_river:   mapper.river,
      place_station: mapper.station,
      place_airport: mapper.airport,
      geohash:       news_geohash,
      lat:           lat,
      long:          long,
      category:      mapper.category,
    }).catch((error)=> { console.log(error)})
    console.log("----> updateNews finish")
  }

  public updateAllNewsBySnapshot = (docs)=>{
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
        await this.updateNews(data)
        // 再帰
        await this.updateAllNewsBySnapshot(newSnapshot.docs[0])
      }
    })
  }

  public updateAllNews = async() => {
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
        await this.updateNews(data)
        await this.updateAllNewsBySnapshot(snapshot.docs[0])
      }
    })
  }
}