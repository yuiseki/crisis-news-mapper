

const admin = require('firebase-admin')
const request = require('request')
const cheerio = require('cheerio')
const geohash = require('ngeohash');
import * as md5 from 'md5';
import { Mapper } from './mapper';

export class News {

  public static fetch = async(url:string) => {
    return await News.asyncFetch(url)
  }

  public static asyncFetch = async(url:string):Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log("----> asyncFetch start: "+url)
      request(url, (error, response, body) => {
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
                News.asyncFetch(newUrl)
                break
              default:
                resolve(null)
            }
          }
      })
    })
  }

  public static asyncParse = async(html:string) => {
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



  public updateNews = async(url) => {
    console.log("----> updateNews: "+url)
    const enurl = md5(url)
    const html:any = await News.asyncFetch(url)
    if (html===null){
      await admin.firestore().collection('news').doc(enurl).update({
        url: url,
        redirect: 1
      })
      return
    }
    const web:any = await News.asyncParse(html)
    const text = web.title+web.og_title+web.og_desc
    const mapper = new Mapper(text)
    console.log("country: "+mapper.country)
    console.log("pref: "+mapper.pref)
    console.log("city: "+mapper.city)
    let location = null
    if (mapper.location!==undefined && mapper.location!==null){
      location = {
        geohash: geohash.encode(mapper.location.lat, mapper.location.long),
        geopoint: new admin.firestore.GeoPoint(mapper.location.lat, mapper.location.long)
      }
    }
    
    await admin.firestore().collection('news').doc(enurl).update({
      url: url,
      redirect: 0,
      title: web.title,
      og_title: web.og_title,
      og_desc: web.og_desc,
      og_image: web.og_image,
      og_url : web.og_url,
      place_country: mapper.country,
      place_area: null,
      place_state: null,
      place_pref: mapper.pref,
      place_city: mapper.city,
      place_mountain: mapper.mountain,
      place_river: mapper.river,
      place_station: mapper.station,
      place_airport: mapper.airport,
      location: location
    })
    console.log("----> updateNews finish")
  }

  public updateAllNews = async() => {
    return new Promise(async (resolve, reject)=>{
      console.log("----> updateAllNews start")
      const query = await admin.firestore().collection("news")
        .where("title", '==', null)
        .where("redirect", '<', 1)
        .where("location", '==', null)
        .limit(1).get()
      if (query.empty) {
        reject('No matching documents!')
      }
      query.forEach(async doc => {
        await this.updateNews(doc.data().url)
        console.log("----> updateAllNews finish")
        setTimeout(()=>{
            // tslint:disable-next-line: no-floating-promises
            this.updateAllNews()
          }, 1000)
      })
    })
  }
}