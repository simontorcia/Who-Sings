import { gameClient } from '../src/clients/game.client'
import { trackService } from '../src/services/track.service'
import { musixmatchService } from '../src/external_services/musixmatch/musixmatch.service'

import * as sinon from 'sinon'
import chai from 'chai'
import nock from 'nock'

import { musixmatchServiceStub } from './stubs/musixmatch_service'
import { O_NONBLOCK } from 'constants'
import {
  ORIGIN,
  GET_TRACKS_CONFIG,
} from '../src/external_services/musixmatch/config/musixmatch.config'

// const inputEvents = require('./stubs/events.stubs')
// require('dotenv').config()

describe('Controller::gameController', () => {
  const sandbox = sinon.createSandbox()

  beforeEach(function () {
    nock('https://api.musixmatch.com')
      .get('/ws/1.1/track.search')
      .reply(200, { success: true })

    sandbox
      .stub(musixmatchService, 'getTrackList')
      .callsFake(async function fakeFn() {
        return []
      })

    sandbox
      .stub(trackService, 'getUsedPages')
      .callsFake(async function fakeFn() {
        return ['10', '11']
      })

    sandbox
      .stub(trackService, 'getValidTrackList')
      .callsFake(async function fakeFn() {
        return []
      })

    sandbox
      .stub(trackService, 'createTrackList')
      .callsFake(async function fakeFn() {
        return []
      })
  })

  afterEach(async () => {
    nock.cleanAll()
    sandbox.restore()
  })

  it('Test msg', async () => {
    await gameClient.startGame(
      {
        game_size: 10,
      },
      'start-game'
    )
  })
})

// it('Test', (done) => {
//   //your code
//   done();
//   }).timeout(10000);

// let clonedQuote = inputEvents.quote
// sandbox.stub(hubspot, 'getDealByMicrocip').callsFake(function fakeFn() {
//   return { id: 12434, response_total: 1 }
// })
// let upsertDealStub = sandbox
//   .stub(hubspot, 'upsertDeal')
//   .callsFake(function fakeFn() {
//     return 213554
//   })
// await hubspot.upsertDealToHubspot(clonedQuote, 1234, null, 54534)
// sinon.assert.calledOnce(hubspot.upsertDeal)
// assert.equal(
//   upsertDealStub.getCalls()[0].args[1].properties.dealname,
//   'New business - Quoteref 4FEWMZ-c'
// )
// assert.equal(
//   upsertDealStub.getCalls()[0].args[1].properties.false_new_business,
//   true
// )
