import { describe, it } from 'mocha'
import assert = require('assert'); 

import { Dispatch } from '../src/dispatch'


describe('class Dispatch', () => {

  it('Dispatch.fetchFireDeptDispatchJsonAsync()でJSONを取得できる', async ()=>{
    const json = await Dispatch.fetchFireDeptDispatchJsonAsync()
    assert(json!==null)
  }).timeout(10000)

  it('Dispatch.convertFireDeptDispatchJsonAsync()でfirestoreに保存するobjectに変換できる', async ()=>{
    const json = await Dispatch.fetchFireDeptDispatchJsonAsync()
    const dispatches = await Dispatch.convertFireDeptDispatchJsonAsync(json)
    assert(dispatches!==null)
    assert(dispatches.length > 0)
    assert(dispatches[0]!==null)
    assert(dispatches[0].lat!==undefined)
    assert(dispatches[0].long!==undefined)
    assert(dispatches[0].geohash!==undefined)
  }).timeout(10000)

})