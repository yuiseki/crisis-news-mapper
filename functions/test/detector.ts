import { describe, it } from 'mocha'
import assert = require('assert'); 
import { Detector } from '../src/detector'

describe('Mapperクラスのテスト', () => {

  it('Detector.locationListが正常に展開される', async ()=>{
    const detector = new Detector("")
    await detector.ready
    assert(detector!==null)
    assert(Object.keys(Detector.locationList.country.data).includes("日本")===true)
    assert(Object.keys(Detector.locationList.pref.data).includes("東京都")===true)
    assert(Object.keys(Detector.locationList.city.data).includes("台東区")===true)
  })

  it('new Mapper()できる', async ()=>{
    const detector = new Detector("東京特許許可局")
    await detector.ready
    assert(detector!==null)
  })

  it('街の名前だけで国と県も特定できる1', async ()=>{
    const detector = new Detector("台東区")
    await detector.ready
    assert(detector.city==="台東区")
    assert(detector.pref==="東京都")
    assert(detector.country==="日本")
  })

  it('街の名前だけで国と県も特定できる2', async ()=>{
    const detector = new Detector("町田市")
    await detector.ready
    assert(detector.city==="町田市")
    assert(detector.pref==="東京都")
    assert(detector.country==="日本")
  })

  it('適当な文字列から地名抽出できる1', async ()=>{
    const detector = new Detector("台風19号　東京都心でも猛烈な風　歴代2位(日直予報士 2019年10月12日) - 日本気象協会 tenki.jp")
    await detector.ready
    assert(detector.country==='日本')
    assert(detector.pref==='東京都')
  })

  it('適当な文字列から地名抽出できる2', async ()=>{
    const detector = new Detector("ラグビーワールドカップで日本がスコットランド戦に勝利し、史上初の決勝トーナメント進出です。 　初のベスト８に王手をかけ、プール最終戦、スコットランドと対戦した日本。引き分け以上で史上初のベスト８入りが決定します。 　前半は松島選手や稲垣選手、福岡選手が３本のトライを決め、２１対７とリードして終えます。そして迎えた後半、福岡選手が２つめのトライを決めるなど、その後も追い上げるスコットランドを必死に抑え、日本はスコットランドに２８対２１で勝利。ラグビーＷ杯で見事、初のベスト８進出を決めました。 　次は準々決勝、今月２０日に南アフリカと対戦します。（13日22:21）")
    await detector.ready
    assert(detector.country==='日本')
    assert(detector.pref===null)
  })

})
