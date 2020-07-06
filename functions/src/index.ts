
const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

const ngeohash = require('ngeohash')

/**
 * https://crisis.yuiseki.net/news
 * https://crisis.yuiseki.net/news?category=crisis&daysago=3
 * のようなパスを処理する関数
 * @param {Express.Request} req
 * @param {Express.Response} res ニュース一覧JSON、最大1000件
 * @param {string} req.query.country ニュースを絞り込む国名
 * @param {string} req.query.category ニュースを絞り込むカテゴリ名
 *   crisis, accident, incident, children, drug, politics, sports, japan, nationwide
 * @param {number} req.query.daysago ニュースを何日前まで取得するか
 */
exports.news = functions.https.onRequest(async (req, res) => {
  let country
  if(req.query.country===undefined){
    // デフォルト地域
    country = "日本"
  }else{
    country = req.query.country
    if(country==="null"){
      country = null
    }
  }
  let category
  if (req.query.category===undefined){
    // デフォルトカテゴリ
    category = "crisis"
  }else{
    category = req.query.category
  }
  let daysago
  if (req.query.daysago===undefined){
    // デフォルト日時範囲
    daysago = 3
  }else{
    daysago = Number(req.query.daysago)
  }
  const today = new Date();
  const endat = new Date(today.getTime() - (daysago * 24 * 60 * 60 * 1000));
  // firestoreクエリを組み立てる
  const query = await admin.firestore()
    .collection("news")
    .where("place_country", "==", country)
    .where("category", "==", category)
    .orderBy("tweeted_at", "desc")
    .endAt(endat)
    .limit(1000)
    .get()
  if(query.empty){
    // 0件
    res.status(200).send(JSON.stringify([]))
  }else{
    // query.docs.data()を呼ばないとデータ本体が取得できない
    const results = query.docs.map(doc => {
      const data = doc.data()
      return data
    })
    res.status(200).send(JSON.stringify(results))
  }
})

/**
 * https://crisis.yuiseki.net/firedept
 * のようなパスを処理する関数
 * @param {Express.Request} req
 * @param {Express.Response} res 消防出動一覧、最大500件
 * @param {number} req.query.daysago 何日前まで取得するか
 */
exports.firedept = functions.https.onRequest(async (req, res) => {
  let daysago
  if (req.query.daysago===undefined){
    // 災害
    daysago = 3
  }else{
    daysago = req.query.daysago
  }
  const today = new Date();
  const endat = new Date(today.getTime() - (daysago * 24 * 60 * 60 * 1000));
  const query = await admin.firestore()
    .collection("dispatch")
    .where("place_country", "==", "日本")
    .orderBy("created_at", "desc")
    .endAt(endat)
    .limit(500)
    .get()
  if(query.empty){
    res.status(200).send(JSON.stringify([]))
  }else{
    const results = query.docs.map(doc => {
      const data = doc.data()
      return data
    })
    res.status(200).send(JSON.stringify(results))
  }
})

/**
 * https://crisis.yuiseki.net/selfdefense
 * のようなパスを処理する関数
 * @param {Express.Request} req
 * @param {Express.Response} res 自衛隊災害派遣一覧JSON、最大500件
 * @param {number} req.query.daysago 何日前まで取得するか
 */
exports.selfdefense = functions.https.onRequest(async (req, res) => {
  let daysago
  if (req.query.daysago===undefined){
    // デフォルト日時範囲
    daysago = 3
  }else{
    daysago = req.query.daysago
  }
  const today = new Date();
  const endat = new Date(today.getTime() - (daysago * 24 * 60 * 60 * 1000));
  const query = await admin.firestore()
    .collection("tweets")
    .where("place_country", "==", "日本")
    .where("category", "==", "crisis")
    .where("classification", "==", "selfdefense")
    .orderBy("tweeted_at", "desc")
    .endAt(endat)
    .limit(500)
    .get()
  if(query.empty){
    res.status(200).send(JSON.stringify([]))
  }else{
    const results = query.docs.map(doc => {
      const data = doc.data()
      return data
    })
    res.status(200).send(JSON.stringify(results))
  }
})


/**
 * https://crisis.yuiseki.net/geohash?h=xn774cnd&km=100
 * のようなパスを処理する関数
 * @param {Express.Request} req
 * @param {Express.Response} res ニュース一覧JSON、最大500件
 * @param {string} req.query.h データを取得する中心とするgeohash
 * @param {number} req.query.km データを取得する半径
 */
exports.geohash = functions.https.onRequest(async (req, res) => {
  let h
  if (req.query.h===undefined){
    // デフォルト中心
    h = 'xn774cnd'
  }else{
    h = req.query.h
  }
  let km
  if (req.query.km===undefined){
    // デフォルト半径
    km = 100
  }else{
    km = Number(req.query.km)
  }

  const decode = ngeohash.decode(h)
  // 緯度の1mぶんにあたる値
  const lat = 0.000008983148616
  // 経度の1mぶんにあたる値
  const lon = 0.000010966382364
  const lowerLat = decode.latitude  - (lat * km * 1000)
  const lowerLon = decode.longitude - (lon * km * 1000)
  const upperLat = decode.latitude  + (lat * km * 1000)
  const upperLon = decode.longitude + (lon * km * 1000)
  const lowerHash = ngeohash.encode(lowerLat, lowerLon)
  const upperHash = ngeohash.encode(upperLat, upperLon)
  const query = await admin.firestore()
    .collection("news")
    .where("category", "==", "crisis")
    .where("geohash", ">=", lowerHash)
    .where("geohash", "<=", upperHash)
    .limit(500)
    .get()
  if(query.empty){
    res.status(200).send(JSON.stringify([]))
  }else{
    const results = query.docs.map(doc => {
      const data = doc.data()
      return data
    })
    res.status(200).send(JSON.stringify(results))
  }
})

const runtimeOpt = {
  timeoutSeconds: 540
}

// 消防出動情報を収集するバッチ処理
//import { Dispatch } from './dispatch'
//exports.crawlDispatch = functions.runWith(runtimeOpt).pubsub.schedule('every 10 minutes').onRun(Dispatch.crawlFireDept)

// マスコミRSSからニュース記事を収集するバッチ処理
import { MassMediaFeed } from './MassMediaFeed'
exports.crawlMediaFeeds = functions.runWith(runtimeOpt).pubsub.schedule('every 10 minutes').onRun(MassMediaFeed.crawlMediaFeeds)

// ツイート分析をするバッチ処理
import { Twitter } from './twitter'
exports.updateAllTweets = functions.runWith(runtimeOpt).pubsub.schedule('every 10 minutes').onRun(Twitter.startUpdateAll)

// ニュース分析をするバッチ処理
import { News } from './news'
exports.updateAllNews = functions.runWith(runtimeOpt).pubsub.schedule('every 10 minutes').onRun(News.startUpdateAll)
//exports.reindexCategory = functions.runWith(runtimeOpt).pubsub.schedule('every 12 hours').onRun(News.startReindexCategory)
//exports.reindexLocation = functions.runWith(runtimeOpt).pubsub.schedule('every 12 hours').onRun(News.startReindexLocation)

// 天気予報・気象警報を収集するバッチ処理
//import { WeatherFeed } from './WeatherFeed'
//exports.crawlWeatherFeeds = functions.runWith(runtimeOpt).pubsub.schedule('every 1 hours').onRun(WeatherFeed.crawlFeeds)