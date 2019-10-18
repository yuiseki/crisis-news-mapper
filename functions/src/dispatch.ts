
const admin = require('firebase-admin')
import { News } from './news'
import { Detector } from './detector'

export class Dispatch{

  public static crawlDispatch = async (context) => {
    console.log("----> crawlDispatch start")
    await Dispatch.fetchAndSaveAsync()
    console.log("----> crawlDispatch finish")
  }

  /**
   * json fetchして全部saveする非同期メソッド
   */
  public static fetchAndSaveAsync = async () => {
    const json = await Dispatch.fetchJsonAsync()
    const dispatches = await Dispatch.convertJsonAsync(json)
    for (const dispatch of dispatches){
      const dispatchRef = await admin.firestore().collection('dispatch').doc(dispatch.id).get()
      if(!dispatchRef.exists){
        await admin.firestore().collection('dispatch').doc(dispatch.id).set(dispatch)
      }else{
        await admin.firestore().collection('dispatch').doc(dispatch.id).update(dispatch)
      }
    }
  }

  /**
   * jsonをfirestoreに保存できるように変形する非同期メソッド
   * Detectorで場所の特定も行う
   * @returns {any} parsed json object
   */
  public static fetchJsonAsync = async () => {
    const jsonString = await News.fetchAsync('https://www.mk-mode.com/rails/disaster.json')
    return JSON.parse(jsonString)
  }

  public static convertJsonAsync = async (json:any) => {
    console.log("-----> convertJsonAsync start")
    const dispatches = []
    for (const dispatch of json){
      delete dispatch.tweet_id
      dispatch.id = String(dispatch.id)
      if(dispatch.created_at!==null){
        dispatch.created_at = new Date(Date.parse(dispatch.created_at.replace('.000', '')))
      }
      const detector = new Detector(dispatch.detail)
      await detector.ready
      dispatch.place_country = detector.country
      dispatch.place_pref = detector.pref
      dispatch.place_city = detector.city
      dispatch.lat = detector.location.lat
      dispatch.long = detector.location.long
      dispatch.geohash = detector.geohash
      dispatches.push(dispatch)
    }
    console.log("-----> convertJsonAsync finish")
    return dispatches
  }

}