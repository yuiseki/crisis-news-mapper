import assert = require('assert'); 
import { Mapper } from '../src/mapper'

describe('Mapperクラスのテスト', () => {

  it('new Mapper()できる', async ()=>{
    const mapper = new Mapper("東京特許許可局")
    assert(mapper!==null)
  })

  it('Mapperで地名抽出できる1', async ()=>{
    const mapper = new Mapper("台風19号　東京都心でも猛烈な風　歴代2位(日直予報士 2019年10月12日) - 日本気象協会 tenki.jp")
    assert(mapper.country==='日本')
    assert(mapper.pref==='東京都')
  })

  it('Mapperで地名抽出できる2', async ()=>{
    const mapper = new Mapper("ラグビーワールドカップで日本がスコットランド戦に勝利し、史上初の決勝トーナメント進出です。 　初のベスト８に王手をかけ、プール最終戦、スコットランドと対戦した日本。引き分け以上で史上初のベスト８入りが決定します。 　前半は松島選手や稲垣選手、福岡選手が３本のトライを決め、２１対７とリードして終えます。そして迎えた後半、福岡選手が２つめのトライを決めるなど、その後も追い上げるスコットランドを必死に抑え、日本はスコットランドに２８対２１で勝利。ラグビーＷ杯で見事、初のベスト８進出を決めました。 　次は準々決勝、今月２０日に南アフリカと対戦します。（13日22:21）")
    assert(mapper.country==='日本')
    assert(mapper.pref===null)
  })

  it('Mapperでlocation特定できる3', async ()=>{
    const mapper = new Mapper("台風19号　東京都心でも猛烈な風　歴代2位(日直予報士 2019年10月12日) - 日本気象協会 tenki.jp")
    assert(mapper.location!==undefined)
    console.log(mapper.location)
    assert(mapper.location.lat==='139.69164')
    assert(mapper.location.long==='35.6895')
  })
})
