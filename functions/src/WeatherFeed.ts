
const feedparser = require('feedparser-promised');

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
      // 北海道と沖縄だけ例外
      let i = 2
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
          let v = 1
          while(v < 5){
            v++
            const area = num+'00'+String(v)+'0'
            const url = this.rootAreaUrl+area+'.xml'
            console.log(url)
            try{
              this.rootFeed = await feedparser.parse(url)
              for(const item of this.rootFeed){
                if(!item.title.startsWith('[ PR ]')){
                  console.log(item.title)
                  console.log(item.description)
                  console.log(item.pubDate)
                }
              }
            }catch(e){
              break
            }
          }
        }
      }
      resolve()
    })
  }
}