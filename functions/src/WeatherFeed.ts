const admin = require('firebase-admin')
//const feedparser = require('feedparser-promised');
const request = require('request-promise-native')

export class WeatherFeed {
  ready:Promise<any>
  rootFeed: any
  rootWarnUrl = "http://weather.livedoor.com/forecast/rss/warn/"
  rootAreaUrl = "http://weather.livedoor.com/forecast/rss/area/"
  rootJsonUrl = "http://weather.livedoor.com/forecast/webservice/json/v1?city="
  list = [
    "01a",
    "01b",
    "01c",
    "01d",
  ]

  public static crawlFeeds = async(context) => {
    console.log("crawlFeeds")
    const feed = new WeatherFeed()
    await feed.ready
  }

  constructor(){
    this.ready = new Promise(async (resolve, reject)=>{
      // 北海道=1と沖縄=47だけ例外
      let i = 2
      const days = {}
      while(i !== 46){
        i++
        let num = String(i)
        if(num.length===1){
          num = '0'+num
        }
        if(num==='01'){
          num = num+'a'
        }
        if(num.length===2){
          const area = num+'00'+'10'
          const jsonurl = this.rootJsonUrl+area
          try{
            const jsonString = await request.get(jsonurl)
            const jsondata = JSON.parse(jsonString)
            for(const item of jsondata.forecasts){
              if (!days.hasOwnProperty(item.date)){
                days[item.date] = {}
              }
              if (!days[item.date].hasOwnProperty(jsondata.location.prefecture)){
                days[item.date][jsondata.location.prefecture] = {}
              }
              let min = null
              if(item.temperature.min){
                min = item.temperature.min.celsius
              }
              let max = null
              if(item.temperature.max){
                max = item.temperature.max.celsius
              }
              days[item.date][jsondata.location.prefecture] = {
                telop: item.telop,
                icon: item.image.url,
                max: max,
                min: min
              }
            }
          }catch(e){
            break
          }
        }
      }
      for(const day of Object.keys(days)){
        await admin.firestore().collection('weathers').doc(day).set(days[day])
      }
      resolve()
    })
  }
}