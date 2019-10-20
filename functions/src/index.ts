
const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

const ngeohash = require('ngeohash')

/**
 * http://localhost:5000/news
 * のようなパスを処理する関数
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {string} req.query.category 絞り込むカテゴリ
 */
exports.news = functions.https.onRequest(async (req, res) => {
  let category
  if (req.query.category===undefined){
    // 災害
    category = 'crisis'
  }else{
    category = req.query.category
  }
  // firestoreクエリを組み立てる
  const query = await admin.firestore()
    .collection("news")
    .where("place_country", "==", "日本")
    .where("category", "==", category)
    .orderBy("tweeted_at", "desc")
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
 * http://localhost:5000/dispatch
 * のようなパスを処理する関数
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
exports.dispatch = functions.https.onRequest(async (req, res) => {
  const query = await admin.firestore()
    .collection("dispatch")
    .where("place_country", "==", "日本")
    //.where("category", "==", "crisis")
    .orderBy("created_at", "desc")
    .limit(1000)
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
 * http://localhost:5000/tweets
 * のようなパスを処理する関数
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
exports.tweets = functions.https.onRequest(async (req, res) => {
  const query = await admin.firestore()
    .collection("tweets")
    .where("place_country", "==", "日本")
    .where("category", "==", "crisis")
    .where("classification", "==", "selfdefense")
    .orderBy("tweeted_at", "desc")
    .limit(1000)
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
 * http://localhost:5000/newsByGeoHash?h=xn774cnd&km=100
 * のようなパスを処理する関数
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {string} req.query.h データを取得する中心とするgeohash
 * @param {number} req.query.km データを取得する半径
 */
exports.newsByGeoHash = functions.https.onRequest(async (req, res) => {
  let h
  if (req.query.h===undefined){
    // 新宿駅
    h = 'xn774cnd'
  }else{
    h = req.query.h
  }
  let km
  if (req.query.km===undefined){
    km = 100
  }else{
    km = req.query.km
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
import { Dispatch } from './dispatch'
exports.crawlDispatch = functions.runWith(runtimeOpt).pubsub.schedule('every 5 minutes').onRun(Dispatch.fetchAndSaveFireDeptDispatchAsync)

// マスコミニュース記事を収集するバッチ処理
import { Feed } from './feed'
exports.crawlMediaFeeds = functions.runWith(runtimeOpt).pubsub.schedule('every 10 minutes').onRun(Feed.crawlMediaFeeds)


// Twitter検索するバッチ処理
import { Twitter } from './twitter'
//const twitter = new Twitter()
//exports.crawlTwitter = functions.runWith(runtimeOpt).pubsub.schedule('every 2 minutes').onRun(twitter.crawlTwitter)
// 全Tweetを更新するバッチ処理
exports.updateAllTweets = functions.runWith(runtimeOpt).pubsub.schedule('every 10 minutes').onRun(Twitter.updateAllTweets)

/*
// 全ニュースを更新するバッチ処理
import { News } from './news'
exports.updateAllNews = functions.runWith(runtimeOpt).pubsub.schedule('every 10 minutes').onRun(News.updateAllNews)
*/