const admin = require('firebase-admin')
const ngeohash = require('ngeohash')

const prefList = require('../data/k.river.go.jp/pref.json')
const cityList = require('../data/k.river.go.jp/twn.json')

import { News } from './news'

export class RiverLevel {
  ready:Promise<any>
  url: string
  feed: string
  items: any

  public static crawlRiverRevel = async(context) => {
    for (const pref of prefList.prefs){
      console.log(pref.name+": "+pref.code)
      if(pref.code===null){return}
      
      const url = "https://k.river.go.jp/swin/files/area_info/current/"+pref.code+".json"
      const jsonString = await News.fetchAsync(url)
      const json = JSON.parse(jsonString)
      const riverLevels = await RiverLevel.convertRiverLevelJsonAsync(json)
      for (const riverLevel of riverLevels){
        const riverLevelRef = await admin.firestore().collection('river-level').doc(riverLevel.id).get()
        if(!riverLevelRef.exists){
          await admin.firestore().collection('river-level').doc(riverLevel.id).set(riverLevel)
        }else{
          await admin.firestore().collection('river-level').doc(riverLevel.id).update(riverLevel)
        }
      }
    }
  }

  public static convertRiverLevelJsonAsync = async (json:any) => {
    const riverLevels = []
    for (const riverLevel of json.obss){
      riverLevel.created_at = new Date(Date.parse(riverLevel.obsTime))
      riverLevel.id = riverLevel.code+"_"+riverLevel.created_at
      riverLevel.updated_at = admin.firestore.FieldValue.serverTimestamp()
      riverLevel.place_country = "日本"
      for (const pref of prefList.prefs){
        if (riverLevel.prefCode === pref.code){
          riverLevel.place_pref = pref.name
        }
      }
      for (const city of cityList.towns){
        if (riverLevel.twnCode === city.code){
          riverLevel.place_city = city.name
        }
      }
      riverLevel.long = riverLevel.lon
      riverLevel.geohash = ngeohash.encode(riverLevel.lat, riverLevel.long)
      riverLevels.push(riverLevel)
    }
    return riverLevels
  }

}