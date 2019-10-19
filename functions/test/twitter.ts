const test = require('firebase-functions-test')();
import { describe, it } from 'mocha'
import assert = require('assert')
import { Twitter } from '../src/twitter'

describe('class Twitter', () => {

  it('new Twitter()できる', async () => {
    const twitter = new Twitter()
    assert(twitter!==null)
  })

})