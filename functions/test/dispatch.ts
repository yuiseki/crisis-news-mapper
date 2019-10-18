import { describe, it } from 'mocha'
import assert = require('assert'); 
import { Dispatch } from '../src/dispatch'


describe('Dispatchクラスのテスト', () => {

  it('Dispatch.fetchJsonAsync()', async ()=>{
    const json = await Dispatch.fetchJsonAsync()
    assert(json!==null)
  }).timeout(10000)

  it('Dispatch.convertJsonAsync()', async ()=>{
    const json = await Dispatch.fetchJsonAsync()
    const dispatches = await Dispatch.convertJsonAsync(json)
    assert(dispatches!==null)
    assert(dispatches.length > 0)
    assert(dispatches[0]!==null)
    assert(dispatches[0].lat!==undefined)
    assert(dispatches[0].long!==undefined)
    assert(dispatches[0].geohash!==undefined)
  }).timeout(10000)

})