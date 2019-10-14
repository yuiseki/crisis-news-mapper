
const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

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

exports.newsByPref = functions.https.onRequest(async (req, res) => {
  let pref
  if (req.query.pref===undefined){
    pref = '東京都'
  }else{
    pref = req.query.pref
  }
  const query = await admin.firestore().collection("news")
    .where("place_pref",  "==", pref)
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