import { gameClient } from '../src/clients/game.client'
import { trackService } from '../src/services/track.service'
import { musixmatchService } from '../src/external_services/musixmatch/musixmatch.service'
import * as sinon from 'sinon'
import nock from 'nock'
import { musixmatchServiceStub } from './stubs/musixmatch_service'
import { artistService } from '../src/services/artist.service'
import { assert } from 'chai'
import { trackHelper } from '../src/helpers/track.helper'
import { gameHelper } from '../src/helpers/game.helper'

describe('Controller::gameController', () => {
  const sandbox = sinon.createSandbox()

  beforeEach(function () {
    // sandbox
    // .stub(musixmatchService, 'getTrackList')
    // .callsFake(async function fakeFn() {
    //   return musixmatchServiceStub.getTrackList
    // })

    // sandbox
    //   .stub(musixmatchService, 'getSnippetByTrackId')
    //   .callsFake(async function fakeFn() {
    //     return musixmatchServiceStub.getSnippetByTrackId.snippet_body
    //   })

    // sandbox
    //   .stub(musixmatchService, 'getRelatedArtistList')
    //   .callsFake(async function fakeFn() {
    //     return musixmatchServiceStub.getRelatedArtistList
    //   })

    sandbox
      .stub(artistService, 'getRelatedArtistNameList')
      .callsFake(async function fakeFn() {
        return []
      })

    sandbox
      .stub(artistService, 'addRelatedArtistList')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getRelatedArtistList[0]
      })

    sandbox
      .stub(trackService, 'getUsedPages')
      .callsFake(async function fakeFn() {
        return ['10', '11']
      })

    sandbox
      .stub(trackService, 'getValidTrackList')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getTrackList
      })

    sandbox
      .stub(trackService, 'updateManyPlayed')
      .callsFake(async function fakeFn() {
        return {}
      })

    sandbox
      .stub(artistService, 'createArtistList')
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

  // it('Test msg', async () => {
  //   const getTrackListResponse = sandbox
  //     .stub(musixmatchService, 'getTrackList')
  //     .callsFake(async function fakeFn() {
  //       return musixmatchServiceStub.getTrackList
  //     })

  //   await gameClient.startGame(
  //     {
  //       game_size: 4,
  //     },
  //     'start-game'
  //   )
  // })

  it('game_size < (2*track_list.length saved Into DB. External Providers not called', async function () {
    const getTrackListResponse = sandbox
      .stub(musixmatchService, 'getTrackList')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getTrackList
      })

    const getSnippetListResponse = sandbox
      .stub(musixmatchService, 'getSnippetByTrackId')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getSnippetByTrackId.snippet_body
      })

    const getRelatedArtistListResponse = sandbox
      .stub(musixmatchService, 'getRelatedArtistList')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getRelatedArtistList
      })

    sandbox
      .stub(trackHelper, 'getUpdatedBySnippetTrack')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getTrackList[0]
      })

    const game = await gameClient.startGame(
      {
        game_size: 1,
      },
      'start-game'
    )

    sinon.assert.callCount(getTrackListResponse, 0)
    sinon.assert.callCount(getSnippetListResponse, 0)
    sinon.assert.callCount(getRelatedArtistListResponse, 1)

    assert.equal(game.length, 1)
    assert.exists(game[0].question)
    assert.exists(game[0].correct_answer)
    assert.exists(game[0].wrong_answers)
  })
})

/**
 *  INPUT = x
 * - check di quante track sul db
 * - se ho meno track di quelle che servono chiamata esterna
 *    - chiamata API
 *        check sulla response del servizio
 * - se ho piu => check sul db
 *
 * - check su snippet
 *
 *
 * Faccio un test in cui ho tutti i dati sul db e non devo chiamare servizi esterni (check su quante volta sono chiamati servizi)
 *
 * Faccio un test in cui i dati sono parziali sul DB e parziali sul servizio esterno
 *
 * Faccio un test in cui DB è vuoto e prendo tutti dati dal servizio esterno
 *
 *
 *
 *
 */
