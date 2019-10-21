
const admin = require('firebase-admin')
//const cheerio = require('cheerio')
import { News } from './news'
import { Detector } from './detector'

export class Dispatch{

  public static crawlDispatch = async (context) => {
    console.log("----> crawlDispatch start")
    await Dispatch.fetchAndSaveFireDeptDispatchAsync()
    console.log("----> crawlDispatch finish")
  }

  /**
   * 消防出動情報のjsonを取得して保存する非同期メソッド
   */
  public static fetchAndSaveFireDeptDispatchAsync = async () => {
    const json = await Dispatch.fetchFireDeptDispatchJsonAsync()
    const dispatches = await Dispatch.convertFireDeptDispatchJsonAsync(json)
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
   * 消防出動情報jsonを取得してパースする非同期メソッド
   * @returns {any} parsed json object
   */
  public static fetchFireDeptDispatchJsonAsync = async () => {
    const jsonString = await News.fetchAsync('https://www.mk-mode.com/rails/disaster.json')
    return JSON.parse(jsonString)
  }

  /**
   * 消防出動情報jsonをfirestoreに保存できるように変形する非同期メソッド
   * Detectorでカテゴリと場所の特定も行う
   * @returns {any} dispatches
   */
  public static convertFireDeptDispatchJsonAsync = async (json:any) => {
    const dispatches = []
    for (const dispatch of json){
      delete dispatch.tweet_id
      dispatch.id = String(dispatch.id)
      if(dispatch.created_at!==null){
        dispatch.created_at = new Date(Date.parse(dispatch.created_at.replace('.000', '')))
      }
      const detector = new Detector(dispatch.division+dispatch.detail)
      await detector.ready
      dispatch.unit = "firedept"
      dispatch.category = detector.category
      dispatch.place_country = detector.country
      dispatch.place_pref = detector.pref
      dispatch.place_city = detector.city
      dispatch.lat = detector.location.lat
      dispatch.long = detector.location.long
      dispatch.geohash = detector.geohash
      dispatch.updated_at = admin.firestore.FieldValue.serverTimestamp()
      dispatches.push(dispatch)
    }
    return dispatches
  }

  public static updateAsync = async(docRef) => {
    const dispatch = docRef.data()
    const detector = new Detector(dispatch.division+dispatch.detail)
    await detector.ready
    dispatch.category = detector.category
    dispatch.place_country = detector.country
    dispatch.place_pref = detector.pref
    dispatch.place_city = detector.city
    dispatch.lat = detector.location.lat
    dispatch.long = detector.location.long
    dispatch.geohash = detector.geohash
    dispatch.updated_at = admin.firestore.FieldValue.serverTimestamp()
    await admin.firestore().collection("dispatch").doc(dispatch.id).update(dispatch)
  }

  public static updateAll = async(startAfterDocRef) => {
    return new Promise(async (resolve, reject)=>{
      if(startAfterDocRef===null || startAfterDocRef===undefined){
        // tslint:disable-next-line: no-parameter-reassignment
        startAfterDocRef = null
      }
      console.log("----> Dispatch.updateAll start: "+startAfterDocRef.id)
      const snapshot = await admin.firestore().collection("dispatch")
        .orderBy('updated_at', 'desc')
        .startAfter(startAfterDocRef)
        .limit(1)
        .get()
      if (snapshot.empty) {
        reject('No matching documents!')
      }else{
        await Dispatch.updateAsync(snapshot.docs[0])
        await Dispatch.updateAll(snapshot.docs[0])
      }
    })
  }

  public static startUpdateAll = async(context) => {
    const snapshot = await admin.firestore().collection("dispatch")
      .orderBy('updated_at', 'desc')
      .limit(1)
      .get()
    await Dispatch.updateAll(snapshot.docs[0])
  }
}