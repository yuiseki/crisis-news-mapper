import { describe, it } from 'mocha'
import assert = require('assert'); 

import { Detector } from '../src/detector'

describe('class Detector', () => {

  it('Detector.locationListが正常に展開される', async ()=>{
    const detector = new Detector("")
    await detector.ready
    assert(detector!==null)
    assert(Object.keys(Detector.locationList.country.data).includes("日本")===true)
    assert(Object.keys(Detector.locationList.pref.data).includes("東京都")===true)
    assert(Object.keys(Detector.locationList.city.data).includes("台東区")===true)
  })

  it('new Detector(text)できる', async ()=>{
    const detector = new Detector("東京特許許可局")
    await detector.ready
    assert(detector!==null)
  })

  it('街の名前だけで国と県も特定できる1', async ()=>{
    const detector = new Detector("台東区")
    await detector.ready
    assert(detector.country==="日本")
    assert(detector.pref==="東京都")
    assert(detector.city==="台東区")
    assert(detector.location!==null)
    assert(detector.location.lat!==null)
    assert(detector.location.long!==null)
  })

  it('街の名前だけで国と県も特定できる2', async ()=>{
    const detector = new Detector("町田市")
    await detector.ready
    assert(detector.country==="日本")
    assert(detector.pref==="東京都")
    assert(detector.city==="町田市")
    assert(detector.location!==null)
    assert(detector.location.lat!==null)
    assert(detector.location.long!==null)
  })

  it('適当な文字列からカテゴリと地名を検出できる1', async ()=>{
    const detector = new Detector("台風19号　東京都心でも猛烈な風　歴代2位(日直予報士 2019年10月12日) - 日本気象協会 tenki.jp")
    await detector.ready
    assert(detector.category==='crisis')
    assert(detector.country==='日本')
    assert(detector.pref==='東京都')
    assert(detector.city===null)
    assert(detector.location!==null)
    assert(detector.location.lat!==null)
    assert(detector.location.long!==null)
  })

  it('適当な文字列からカテゴリと地名を抽出できる2', async ()=>{
    const detector = new Detector("大麻栽培の容疑で兄弟を逮捕送検　自宅から乾燥大麻や大麻草、吸引用パイプ押収 うるま署と石川署、県警刑事部組織犯罪対策課の合同捜査班は16日、うるま市の自宅アパートなどで販売を目的に大麻を所持、栽培していたとして大麻取締法違反（営利目的共同所持・栽培）の容疑で、共に無職で同...")
    await detector.ready
    assert(detector.category==='drug')
    assert(detector.country==='日本')
    assert(detector.pref==='沖縄県')
    assert(detector.city==='うるま市')
  })

  it('適当な文字列からカテゴリと地名を抽出できる3', async ()=>{
    const detector = new Detector("児童買春の元小学校教諭、公判中に別の女子中学生買春 : 国内 : ニュース 福岡県警直方署は、児童買春・児童ポルノ禁止法違反（児童買春）の疑いで、福岡市南区三宅２、元小学校教諭内村和憲容疑者（３５）を逮捕した。逮捕は１６日。 　発表によると、内村容疑者は４月１３日、同市内のホテルで、中学３年の")
    await detector.ready
    assert(detector.category==='children')
    assert(detector.country==='日本')
    assert(detector.pref==='福岡県')
    assert(detector.city==='福岡市')
  })

  it('適当な文字列からカテゴリと地名を抽出できる4', async ()=>{
    const detector = new Detector("ラグビーワールドカップで日本がスコットランド戦に勝利し、史上初の決勝トーナメント進出です。 　初のベスト８に王手をかけ、プール最終戦、スコットランドと対戦した日本。引き分け以上で史上初のベスト８入りが決定します。 　前半は松島選手や稲垣選手、福岡選手が３本のトライを決め、２１対７とリードして終えます。そして迎えた後半、福岡選手が２つめのトライを決めるなど、その後も追い上げるスコットランドを必死に抑え、日本はスコットランドに２８対２１で勝利。ラグビーＷ杯で見事、初のベスト８進出を決めました。 　次は準々決勝、今月２０日に南アフリカと対戦します。（13日22:21）")
    await detector.ready
    assert(detector.category==='sports')
    assert(detector.country==='日本')
    assert(detector.pref===null)
    assert(detector.city===null)
  })

})
