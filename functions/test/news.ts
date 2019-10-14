import { describe, it } from 'mocha'
import assert = require('assert')
import { News } from '../src/news'

describe('Newsクラスのテスト', () => {
  const firebase = require('firebase-admin')
  const serviceAccount = require("/home/ubuntu/news-mapper-web/functions/secrets/key.json");
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://news-mapper-49a5c.firebaseio.com"
  });

  it('News.get()メソッドでhtmlを取得できる', async () => {
    const html:string = await News.asyncFetch('https://www.google.co.jp/')
    assert(html!==null)
  })

  it('News.parse()メソッドでhtmlを解釈できる1', async () => {
    const html:string = await News.asyncFetch('https://www.google.co.jp/')
    const web:any = await News.asyncParse(html)
    assert(web!==null)
    assert(web.title==='Google')
  })

  it('News.parse()メソッドでhtmlを解釈できる2', async () => {
    const html:string = await News.asyncFetch('https://www.asahi.com/articles/ASMBF32G3MBFUOOB00L.html')
    const web:any = await News.asyncParse(html)
    assert(web!==null)
    assert(web.title==='千曲川決壊、老人施設で避難　家族数人逃げ遅れの情報も [台風１９号]：朝日新聞デジタル')
  })

  it('News.parse()メソッドでhtmlを解釈できる3', async () => {
    const html:string = await News.asyncFetch('https://tenki.jp/forecaster/deskpart/2019/10/12/6281.html')
    const web:any = await News.asyncParse(html)
    assert(web!==null)
    assert(web.title==='台風19号　東京都心でも猛烈な風　歴代2位(日直予報士 2019年10月12日) - 日本気象協会 tenki.jp')
  }).timeout(6000);

  it('news.updateNews()メソッドが動く', async () => {
    const news = new News()
    await news.updateNews('https://tenki.jp/forecaster/deskpart/2019/10/12/6281.html')
  }).timeout(8000)

})