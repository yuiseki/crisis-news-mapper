import { describe, it } from 'mocha'
import assert = require('assert')
import { News } from '../src/news'

describe('Newsクラスのテスト', () => {
  const firebase = require('firebase-admin')
  firebase.initializeApp()

  it('News.fetchAsync()できる', async () => {
    const html = await News.fetchAsync('https://www.google.co.jp/')
    assert(html!==null)
  })

  it('News.parseAsync()でHTMLを解釈できる1', async () => {
    const html = await News.fetchAsync('https://www.google.co.jp/')
    const web = await News.parseAsync(html)
    assert(web!==null)
    assert(web.title==='Google')
  })

  it('News.parse()メソッドでhtmlを解釈できる2', async () => {
    const html:string = await News.fetchAsync('https://www.asahi.com/articles/ASMBF32G3MBFUOOB00L.html')
    const web:any = await News.parseAsync(html)
    assert(web!==null)
    assert(web.title==='千曲川決壊、老人施設で避難　家族数人逃げ遅れの情報も [台風１９号]：朝日新聞デジタル')
  }).timeout(3000)

  it('News.parse()メソッドでhtmlを解釈できる3', async () => {
    const html:string = await News.fetchAsync('https://tenki.jp/forecaster/deskpart/2019/10/12/6281.html')
    const web:any = await News.parseAsync(html)
    assert(web!==null)
    assert(web.title==='台風19号　東京都心でも猛烈な風　歴代2位(日直予報士 2019年10月12日) - 日本気象協会 tenki.jp')
  }).timeout(5000)

  it('new News()できる', async () => {
    const news = new News('https://www.google.co.jp/')
    await news.ready
    assert(news!==null)
    assert(news.url==='https://www.google.co.jp/')
    assert(news.enurl!==null)
  }).timeout(5000)

  it('firestoreに存在しないURLの場合: new News()したらfetchAsyncとparseAsyncを呼ぶ', async () => {
    const news = new News('https://www.google.co.jp/')
    await news.ready
    assert(news.exists===false)
    assert(news.html!==null)
    assert(news.web!==null)
    assert(news.web.title==='Google')
  }).timeout(5000)

  it('firestoreに存在するURLの場合: new News()したらfirestoreのデータを取得する', async () => {
    const news = new News('https://www.fnn.jp/posts/00425593CX/201910141711_CX_CX')
    await news.ready
    assert(news.exists===true)
    assert(news.html===null)
    assert(news.web!==null)
    assert(news.web.title==='【速報】利根川が満潮で増水　床上浸水などの被害も - FNN.jpプライムオンライン')
  }).timeout(5000)

  it('最新ツイート日時が取得できる', async () => {
    const news = new News('https://www.fnn.jp/posts/00425593CX/201910141711_CX_CX')
    await news.ready
    assert(news.data.tweets!==null)
    assert(news.data.tweets.length > 0)
    const tweeted_at = await news.getTweetedAtAsync()
    assert(tweeted_at!==null)
  })

  it('detectorが正常に動作する', async () => {
    const news = new News('https://www.fnn.jp/posts/00425593CX/201910141711_CX_CX')
    await news.ready
    const detector = await news.getDetectorAsync()
    assert(detector!==null)
    assert(detector.country==='日本')
    assert(detector.pref==='千葉県')
    assert(detector.city==='銚子市')
    assert(detector.location!==undefined)
    assert(detector.location!==null)
    assert(detector.location.lat!==null)
    assert(detector.location.long!==null)
    assert(detector.geohash!==null)
  })

  it('newsDocParamを組み立てられる', async () => {
    const news = new News('https://www.fnn.jp/posts/00425593CX/201910141711_CX_CX')
    await news.ready
    const param = await news.getNewsDocParamAsync()
    assert(param!==null)
    assert(param.url==='https://www.fnn.jp/posts/00425593CX/201910141711_CX_CX')
    assert(param.enurl!==null)
    assert(param.updated_at!==null)
    assert(param.tweeted_at!==null)
    assert(param.tweets!==null)
    assert(param.tweets.length > 0)
    assert(param.category==='crisis')
    assert(param.lat!==null)
    assert(param.long!==null)
  })

})