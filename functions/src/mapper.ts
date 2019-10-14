
const kuromoji = require('kuromoji')
const kuromojiBuilder = kuromoji.builder({
  dicPath: 'node_modules/kuromoji/dict'
})

const fs = require('fs')
const csv = require('csv');
const locationList = {
  country:
    {
      index:
        {
          filename: 'geonlp_world_country_20130912_u.csv',
          name_idx: 4,
          lat_idx:  9,
          long_idx: 10
        },
      data: {}
    },
  pref:
    {
      index:
        {
          filename: 'geonlp_japan_pref_20140115_u.csv',
          name_idx: 6,
          lat_idx:  12,
          long_idx: 11
        },
      data: {}
    },
  city:
    {
      index:
        {
          filename: 'geonlp_japan_city_20140310_u.csv',
          name_idx: 4,
          lat_idx:  12,
          long_idx: 11
        },
      data: {}
    },
  river:
    {
      index:
        {
          filename: 'geonlp_japan_river_20130912_u.csv',
          name_idx: 2,
          lat_idx:  6,
          long_idx: 7
        },
      data: {}
    },
  mountain:
    {
      index:
        {
          filename: 'geonlp_japan_city_20140310_u.csv',
          name_idx: 4,
          lat_idx:  12,
          long_idx: 11
        },
      data: {}
    },
  station:
    {
      index:
        {
          filename: 'geonlp_japan_station_20130912_u.csv',
          name_idx: 2,
          lat_idx:  8,
          long_idx: 9
        },
      data: {}
    },
  airport:
    {
      index:
        {
          filename: 'geonlp_japan_airport_20130912_u.csv',
          name_idx: 6,
          lat_idx:  10,
          long_idx: 11
        },
      data: {}
    },
}

for (const locationKey of Object.keys(locationList)){
  const location = locationList[locationKey]
  const parser = csv.parse((error, data) => {
    data.forEach((element, index, array) => {
      const name = element[location.index.name_idx]
      if (
          // nameが1文字ではない
          name.length !== 1
          // nameに(が含まれない
          && name.indexOf("(") === -1
          // latが空ではない
          && element[location.index.lat_idx] !== null
          && element[location.index.lat_idx] !== undefined
          && element[location.index.lat_idx] !== ''
          // longが空ではない
          && element[location.index.long_idx] !== null
          && element[location.index.long_idx] !== undefined
          && element[location.index.long_idx] !== ''
        ){
        location.data[name] = {
          lat: parseFloat(element[location.index.lat_idx]),
          long: parseFloat(element[location.index.long_idx])
        }
      }
    })
    console.log("Loaded files: "+location.index.filename)
  })
  fs.createReadStream('/home/ubuntu/news-mapper-web/functions/data/'+location.index.filename).pipe(parser);
}


export class Mapper {
  text:string
  countries:string[]
  country:string
  prefs:string[]
  pref:string
  cities:string[]
  city:string
  rivers:string[]
  river:string
  mountains:string[]
  mountain:string
  stations:string[]
  station:string
  airports:string[]
  airport:string
  location:any

  constructor(text:string){
    this.text = text
    this.location = null
    this.extractCountry()
    this.extractPref()
    this.extractCity()
    this.extractRiver()
    this.extractMountain()
    this.extractStation()
    this.extractAirport()
  }

  public extractCountry(){
    this.countries = this.extract(locationList.country.data)
    this.country = this.countries[0]
    if (this.country===undefined){
      this.country = null
    }else{
      this.location = locationList.country.data[this.country]
    }
  }

  public extractPref(){
    this.prefs = this.extract(locationList.pref.data)
    this.pref = this.prefs[0]
    if (this.pref===undefined){
      this.pref = null
    }else{
      this.location = locationList.pref.data[this.pref]
    }
  }

  public extractCity(){
    this.cities = this.extract(locationList.city.data)
    this.city = this.cities[0]
    if (this.city===undefined){
      this.city = null
    }else{
      this.location = locationList.city.data[this.city]
    }
  }

  public extractRiver(){
    this.rivers = this.extract(locationList.river.data)
    this.river = this.rivers[0]
    if (this.river===undefined){
      this.river = null
    }
  }

  public extractMountain(){
    this.mountains = this.extract(locationList.mountain.data)
    this.mountain = this.mountains[0]
    if (this.mountain===undefined){
      this.mountain = null
    }
  }

  public extractStation(){
    this.stations = this.extract(locationList.station.data)
    this.station = this.stations[0]
    if (this.station===undefined){
      this.station = null
    }
  }

  public extractAirport(){
    this.airports = this.extract(locationList.airport.data)
    this.airport = this.airports[0]
    if (this.airport===undefined){
      this.airport = null
    }
  }

  public extract(areaData:any):string[] {
    const areaNames = Object.keys(areaData)
    const areaCounter = {}
    for (const areaName of areaNames){
      const regExp = new RegExp(areaName, "g")
      const count = (this.text.match(regExp) || []).length
      if (count > 0){
        areaCounter[areaName] = count
      }
    }
    const areaNamesSorted = Object.keys(areaCounter).sort(
      (a, b) => {
        return (areaCounter[a] < areaCounter[b] ? 1 : -1 )
      }
    )
    return areaNamesSorted
  }

  /**
   * 分かち書きする関数
   * @param text 分かち書きしたいテキスト
   * @param only_place 地名だけ抽出する
   * @returns {Promise.string[]}
   */
  public static async splitText(text:string, only_place:boolean):Promise<string[]> {
    return await this.asyncSplitText(text, only_place)
  }

  public static asyncSplitText(text:string, only_place:boolean):Promise<string[]>{
    return new Promise((resolve, reject) => {
      kuromojiBuilder.build((error, tokenizer) => {
        if (error){
          reject(error)
        }else{
          const tokens = tokenizer.tokenize(text)
          let words:string[]
          if (only_place){
            words = tokens.filter((token) => {
              return token.pos === '名詞' && token.pos_detail_2 === '地域'
            }).map((token)=>{
              return token.surface_form
            })
          }else{
            words = tokens.map((token)=>{
              return token.surface_form
            })
          }
          resolve(words)
        }
      })
    })
  }
}
