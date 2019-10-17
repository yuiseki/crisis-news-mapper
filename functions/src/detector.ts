


const fs = require('fs')
const csvParseSync = require('csv-parse/lib/sync')

const categoryList = {
  crisis: [
    "地震",
    "台風",
    "豪雨",
    "竜巻",
    "突風",
    "災害",
    "被災",
    "避難",
    "倒壊",
    "崩落",
    // ライフイン
    "停電",
    "断水",
    "給水",
    // 水関係
    "浸水",
    "冠水",
    "氾濫",
    "決壊",
    // 山関係
    "土砂崩れ",
    "土砂流入",
    "土砂災害",
  ],
  children: [
    "虐待",
    "性的虐待",
    "性虐待",
    "性暴力",
    "児童買春",
    "児童ポルノ",
    "児童福祉法",
    "児童福祉司",
    "児童相談所",
    "保護責任者",
  ],
  drug: [
    "麻薬",
    "薬物",
    "乱用",
    "大麻",
    "コカイン",
    "覚醒剤",
    "覚せい剤",
    "危険ドラッグ",
  ],
  politics: [
    "職権乱用",
    "権力乱用",
    "地位乱用",
    "資産乱用",
    "捜査の乱用",
    "優越的地位の乱用",
  ],
  sports: [
    "オリンピック",
    "ワールドカップ",
    "サッカー",
    "ラグビー",
    "テニス",
    "バスケ",
    "ゴルフ",
    "野球",
    "セ・リーグ",
    "パ・リーグ",
  ]
}

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
          long_idx: 11,
          hyperpref: 8
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
          long_idx: 11,
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

export class Detector {
  ready:Promise<any>
  text:string
  country:string
  pref:string
  city:string
  river:string
  mountain:string
  station:string
  airport:string
  location:any
  category:string
  
  static locationList = null

  static categoryList = categoryList

  /**
   * locationListのcsvファイルを読み込んでObjectにする非同期メソッド
   */
  public static loadLocationList = async () => {
    return new Promise( resolve => {
      // locationKey = country, pref, city, ...
      for (const locationKey of Object.keys(locationList)){
        const location = locationList[locationKey]
        // ファイルを読み込む
        const fileData:string = fs.readFileSync('./data/'+location.index.filename)
        // CSVとして解析する
        const rows = csvParseSync(fileData)
        for (const row of rows){
          // 行からname部分を取り出す
          let name:string = row[location.index.name_idx]
          if (
              // nameが1文字ではない
              name.length !== 1
              // nameに(が含まれない
              && name.indexOf("(") === -1
            ){
            if (locationKey==="station"){
              name = name + "駅"
            }
            locationList[locationKey].data[name] = {}
            if (locationKey==="city"){
              locationList[locationKey].data[name].hyperpref = row[location.index.hyperpref].split('/')[0]
            }
            if (
              // latが空ではない
              row[location.index.lat_idx] !== ''
              // longが空ではない
              && row[location.index.long_idx] !== ''
            ){
              locationList[locationKey].data[name].lat = parseFloat(row[location.index.lat_idx])
              locationList[locationKey].data[name].long = parseFloat(row[location.index.long_idx])
            }
          }
        }
      }
      resolve(locationList)
    })
  }

  /**
   * 何らかの文章と検出したいキーワードのリストを渡すと、
   *   - より出現頻度の高いキーワード
   *   - 同じ出現頻度の場合、より長いキーワード
   * でソートしてトップのキーワードを返すメソッド
   * @param {string} text 何らかの文章
   * @param {string[]} areaNames 検出したいキーワードのリスト
   * @return {string} トップのキーワード
   */
  public static detect(text:string, areaNames:string[]):string {
    const areaCounter = {}
    for (const areaName of areaNames){
      const regExp = new RegExp(areaName, "g")
      const count = (text.match(regExp) || []).length
      if (count > 0){
        areaCounter[areaName] = count
      }
    }
    const areaNamesSorted = Object.keys(areaCounter).sort(
      (a, b) => {
        if (areaCounter[a]===areaCounter[b]){
          return (a.length < b.length ? 1 : -1)
        }else{
          return (areaCounter[a] < areaCounter[b] ? 1 : -1 )
        }
      }
    )
    if (areaNamesSorted[0]===undefined){
      return null
    }else{
      return areaNamesSorted[0]
    }
  }

  /**
   * コンストラクタ
   * @param {string} text 分析したい文章
   */
  constructor(text:string){
    this.text = text
    this.location = null
    this.ready = new Promise(async resolve => {
      if (Detector.locationList===null) {
        Detector.locationList = await Detector.loadLocationList()
      }
      this.detecting()
      resolve()
    })
  }

  public detecting = () => {
    this.detectCategory()
    this.detectCountry()
    this.detectPref()
    this.detectCity()
    this.detectRiver()
    this.detectMountain()
    this.detectStation()
    this.detectAirport()
  }

  /**
   * 文章のカテゴリーを検出する
   */
  public detectCategory(){
    this.category = null
    // category = crisis, drug, sports, ...
    for (const category of Object.keys(Detector.categoryList)){
      for (const keyword of Detector.categoryList[category]){
        const regexp = new RegExp(keyword, "g")
        if(this.text.match(regexp)){
          this.category = category
        }
      }
    }
  }


  /**
   * 国を検出する
   */
  public detectCountry(){
    this.country = Detector.detect(this.text, Object.keys(locationList.country.data))
    if (this.country!==null){
      this.location = locationList.country.data[this.country]
    }
  }

  /**
   * 都道府県を検出する
   */
  public detectPref(){
    this.pref = Detector.detect(this.text, Object.keys(locationList.pref.data))
    if (this.pref!==null){
      // 都道府県が検出できているなら国は日本とする
      this.country = "日本"
      this.location = locationList.pref.data[this.pref]
    }
  }

  /**
   * 市区町村を検出する
   */
  public detectCity(){
    this.city = Detector.detect(this.text, Object.keys(locationList.city.data))
    if (this.city!==null){
      // 市区町村が検出できているなら国は日本とする
      this.country = "日本"
      // 市区町村が検出できているなら都道府県も特定できる
      if(this.pref===undefined || this.pref===null){
        this.pref = locationList.city.data[this.city].hyperpref
      }
      // 市区町村のデータはlat, longが空のことがある
      // 空だったら都道府県の座標にしておく
      if(locationList.city.data[this.city].lat===undefined 
        || locationList.city.data[this.city].long===undefined){
        this.location = locationList.city.data[this.pref]
      }else{
        this.location = locationList.city.data[this.city]
      }
    }
  }

  /**
   * 河川を検出する
   */
  public detectRiver(){
    this.river = Detector.detect(this.text, Object.keys(locationList.river.data))
  }

  /**
   * 山を検出する
   */
  public detectMountain(){
    this.mountain = Detector.detect(this.text, Object.keys(locationList.mountain.data))
  }

  /**
   * 駅を検出する
   */
  public detectStation(){
    this.station = Detector.detect(this.text, Object.keys(locationList.station.data))
  }

  /**
   * 空港を検出する
   */
  public detectAirport(){
    this.airport = Detector.detect(this.text, Object.keys(locationList.airport.data))
  }
}
