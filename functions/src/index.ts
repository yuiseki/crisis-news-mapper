
const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

const ngeohash = require('ngeohash')

exports.newsByGeoHash = functions.https.onRequest(async (req, res) => {
  let geohash
  if (req.query.geohash===undefined){
    geohash = 'xn77'
  }else{
    geohash = req.query.geohash
  }
  let rad
  if (req.query.rad===undefined){
    rad = 10
  }else{
    rad = req.query.rad
  }

  const decode = ngeohash.decode(geohash);
  // TODO fix this
  const lat = 0.0074 // degrees latitude per meter
  const lon = 0.0074 // degrees longitude per meter
  const lowerLat = decode.latitude  - (lat * rad * 1000)
  const lowerLon = decode.longitude - (lon * rad * 1000)
  const upperLat = decode.latitude  + (lat * rad * 1000)
  const upperLon = decode.longitude + (lon * rad * 1000)
  const lower = ngeohash.encode(lowerLat, lowerLon);
  const upper = ngeohash.encode(upperLat, upperLon);

  const query = await admin.firestore().collection("news")
    .where("geohash", ">=", lower)
    .where("geohash", "<=", upper)
    .limit(100)
    .get()
  if(query.empty){
    res.status(200).send(JSON.stringify({}))
  }else{
    const results = query.docs.map(doc => {
      return doc.data()
    })
    res.status(200).send(JSON.stringify(results))
  }
})

exports.newsByCountry = functions.https.onRequest(async (req, res) => {
  let country
  if (req.query.country===undefined){
    country = '日本'
  }else{
    country = req.query.country
  }
  const query = await admin.firestore().collection("news")
    .where("place_country",  "==", country)
    .get()
  if(query.empty){
    res.status(200).send(JSON.stringify({}))
  }else{
    const results = query.docs.map(doc => {
      return doc.data()
    })
    res.status(200).send(JSON.stringify(results))
  }
})

import { News } from './news'
const news = new News()
exports.updateAllNews = functions.pubsub.schedule('every 60 minutes').onRun(news.updateAllNews)

import { Twitter } from './twitter'
const twitter = new Twitter()
exports.crawlTwitter = functions.pubsub.schedule('every 10 minutes').onRun(twitter.crawlTwitter)