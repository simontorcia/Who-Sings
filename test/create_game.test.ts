import { gameModule } from '../src/modules/game/game.module'
import { trackModule } from '../src/modules/track/track.module'
import { artistModule } from '../src/modules/artist/artist.module'
import { musixmatchService } from '../src/external_services/musixmatch/musixmatch.service'
import * as sinon from 'sinon'
import nock from 'nock'
import { musixmatchServiceStub } from './stubs/musixmatch_service'
import { assert } from 'chai'
import { artistServiceStub, trackServiceStub } from './stubs/db'

describe('Controller::gameController', () => {
  const sandbox = sinon.createSandbox()

  beforeEach(function () {
    sandbox
      .stub(artistModule.service, 'addRelatedArtistListToArtist')
      .callsFake(async function fakeFn() {
        return artistServiceStub.addRelatedArtistListToArtist
      })

    sandbox
      .stub(trackModule.service, 'getUsedPages')
      .callsFake(async function fakeFn() {
        return trackServiceStub.getUsedPages
      })

    sandbox
      .stub(trackModule.service, 'updateManyPlayed')
      .callsFake(async function fakeFn() {
        return {}
      })

    sandbox
      .stub(artistModule.service, 'createArtistList')
      .callsFake(async function fakeFn() {
        return []
      })

    sandbox
      .stub(trackModule.service, 'createTrackList')
      .callsFake(async function fakeFn() {
        return []
      })
  })

  afterEach(async () => {
    nock.cleanAll()
    sandbox.restore()
  })

  it('Starting game with empty DB', async function () {
    const apiGetTrackList = sandbox
      .stub(musixmatchService, 'getTrackList')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getTrackList
      })

    const apiGetSnippet = sandbox
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
      .stub(trackModule.service, 'addSnippetIntoTrack')
      .onFirstCall()
      .resolves(trackServiceStub.addSnippetIntoTrack[0])
      .onSecondCall()
      .resolves(trackServiceStub.addSnippetIntoTrack[1])

    const fromDBGetTrackList = sandbox
      .stub(trackModule.service, 'getValidTrackList')
      .onFirstCall()
      .resolves(trackServiceStub.empty_valid_track_list)
      .onSecondCall()
      .resolves(trackServiceStub.snippet_empty_valid_track_list)

    const fromDBUpdatedPlayed = sandbox
      .stub(trackModule.service, 'updateOnePlayed')
      .onFirstCall()
      .resolves(trackServiceStub.updateOnePlayed[0])
      .onSecondCall()
      .resolves(trackServiceStub.updateOnePlayed[1])

    sandbox
      .stub(artistModule.service, 'getRelatedArtistNameList')
      .callsFake(async function fakeFn() {
        return artistServiceStub.empty_related_artist_name_list
      })

    const startGameReq = {
      game_size: 2,
      url: 'start-game',
    }

    const game = await gameModule.client.startGame(startGameReq)

    sinon.assert.callCount(apiGetTrackList, 1)
    sinon.assert.callCount(apiGetSnippet, startGameReq.game_size)
    sinon.assert.callCount(getRelatedArtistListResponse, startGameReq.game_size)

    assert.equal(game.length, 2)
    assert.exists(game[0].question)
    assert.exists(game[0].correct_answer)
    assert.exists(game[0].wrong_answers)
  })

  it('Playing with cached Data into DB. External Providers not called', async function () {
    const getTrackListResponse = sandbox
      .stub(musixmatchService, 'getTrackList')
      .callsFake(async function fakeFn() {
        return trackServiceStub.snippet_valid_track_list
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
      .stub(trackModule.helper, 'getUpdatedBySnippetTrack')
      .callsFake(async function fakeFn() {
        return trackServiceStub.snippet_valid_track_list[0]
      })

    const fromDBGetTrackList = sandbox
      .stub(trackModule.service, 'getValidTrackList')
      .resolves(trackServiceStub.snippet_valid_track_list)

    sandbox
      .stub(artistModule.service, 'getRelatedArtistNameList')
      .callsFake(async function fakeFn() {
        return artistServiceStub.related_artist_name_list
      })
    const fromDBUpdatedPlayed = sandbox
      .stub(trackModule.service, 'updateOnePlayed')
      .onFirstCall()
      .resolves(trackServiceStub.updateOnePlayed[0])
      .onSecondCall()
      .resolves(trackServiceStub.updateOnePlayed[1])

    const game = await gameModule.client.startGame({
      game_size: 1,
      url: 'start-game',
    })

    sinon.assert.callCount(getTrackListResponse, 0)
    sinon.assert.callCount(getSnippetListResponse, 0)
    sinon.assert.callCount(getRelatedArtistListResponse, 0)

    assert.equal(game.length, 1)
    assert.exists(game[0].question)
    assert.exists(game[0].correct_answer)
    assert.exists(game[0].wrong_answers)
  })

  it('Playing with many tracks into DB but not enough Snippet and related artists', async function () {
    const getDbTrackListResponse = sandbox
      .stub(trackModule.service, 'getValidTrackList')
      .onFirstCall()
      .resolves(trackServiceStub.snippet_empty_valid_track_list)
      .onSecondCall()
      .resolves(trackServiceStub.snippet_empty_valid_track_list)

    const apiGetTrackList = sandbox
      .stub(musixmatchService, 'getTrackList')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getTrackList
      })

    const apiGetSnippet = sandbox
      .stub(musixmatchService, 'getSnippetByTrackId')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getSnippetByTrackId.snippet_body
      })

    const apiGetRelated = sandbox
      .stub(musixmatchService, 'getRelatedArtistList')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getRelatedArtistList
      })

    sandbox
      .stub(trackModule.service, 'addSnippetIntoTrack')
      .onFirstCall()
      .resolves(trackServiceStub.snippet_valid_track_list[0])
      .onSecondCall()
      .resolves(trackServiceStub.snippet_valid_track_list[1])

    sandbox
      .stub(artistModule.service, 'getRelatedArtistNameList')
      .callsFake(async function fakeFn() {
        return artistServiceStub.empty_related_artist_name_list
      })

    const fromDBUpdatedPlayed = sandbox
      .stub(trackModule.service, 'updateOnePlayed')
      .onFirstCall()
      .resolves(trackServiceStub.updateOnePlayed[0])
      .onSecondCall()
      .resolves(trackServiceStub.updateOnePlayed[1])

    const game = await gameModule.client.startGame({
      game_size: 2,
      url: 'start-game',
    })

    sinon.assert.callCount(getDbTrackListResponse, 1)
    sinon.assert.callCount(apiGetTrackList, 0)
    sinon.assert.callCount(apiGetSnippet, 2)
    sinon.assert.callCount(apiGetRelated, 2)

    assert.equal(game.length, 2)
    assert.exists(game[0].question)
    assert.exists(game[0].correct_answer)
    assert.exists(game[0].wrong_answers)

    assert.exists(game[1].question)
    assert.exists(game[1].correct_answer)
    assert.exists(game[1].wrong_answers)
  })

  it('Playing with many tracks and related artists into DB but not enough Snippet ', async function () {
    const getDbTrackListResponse = sandbox
      .stub(trackModule.service, 'getValidTrackList')
      .onFirstCall()
      .resolves(trackServiceStub.snippet_empty_valid_track_list)
      .onSecondCall()
      .resolves(trackServiceStub.snippet_empty_valid_track_list)

    const apiGetTrackList = sandbox
      .stub(musixmatchService, 'getTrackList')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getTrackList
      })

    const apiGetSnippet = sandbox
      .stub(musixmatchService, 'getSnippetByTrackId')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getSnippetByTrackId.snippet_body
      })

    const apiGetRelated = sandbox
      .stub(musixmatchService, 'getRelatedArtistList')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getRelatedArtistList
      })

    sandbox
      .stub(trackModule.service, 'addSnippetIntoTrack')
      .onFirstCall()
      .resolves(trackServiceStub.snippet_valid_track_list[0])
      .onSecondCall()
      .resolves(trackServiceStub.snippet_valid_track_list[1])

    sandbox
      .stub(artistModule.service, 'getRelatedArtistNameList')
      .callsFake(async function fakeFn() {
        return artistServiceStub.related_artist_name_list
      })

    const fromDBUpdatedPlayed = sandbox
      .stub(trackModule.service, 'updateOnePlayed')
      .onFirstCall()
      .resolves(trackServiceStub.updateOnePlayed[0])
      .onSecondCall()
      .resolves(trackServiceStub.updateOnePlayed[1])

    const game = await gameModule.client.startGame({
      game_size: 2,
      url: 'start-game',
    })

    sinon.assert.callCount(getDbTrackListResponse, 1)
    sinon.assert.callCount(apiGetTrackList, 0)
    sinon.assert.callCount(apiGetSnippet, 2)
    sinon.assert.callCount(apiGetRelated, 0)

    assert.equal(game.length, 2)
    assert.exists(game[0].question)
    assert.exists(game[0].correct_answer)
    assert.exists(game[0].wrong_answers)

    assert.exists(game[1].question)
    assert.exists(game[1].correct_answer)
    assert.exists(game[1].wrong_answers)
  })

  it('Playing with many tracks and snippets into DB but not enough related artists ', async function () {
    const getDbTrackListResponse = sandbox
      .stub(trackModule.service, 'getValidTrackList')
      .onFirstCall()
      .resolves(trackServiceStub.snippet_valid_track_list)
      .onSecondCall()
      .resolves(trackServiceStub.snippet_valid_track_list)

    const apiGetTrackList = sandbox
      .stub(musixmatchService, 'getTrackList')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getTrackList
      })

    const apiGetSnippet = sandbox
      .stub(musixmatchService, 'getSnippetByTrackId')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getSnippetByTrackId.snippet_body
      })

    const apiGetRelated = sandbox
      .stub(musixmatchService, 'getRelatedArtistList')
      .callsFake(async function fakeFn() {
        return musixmatchServiceStub.getRelatedArtistList
      })

    sandbox
      .stub(trackModule.service, 'addSnippetIntoTrack')
      .onFirstCall()
      .resolves(trackServiceStub.snippet_valid_track_list[0])
      .onSecondCall()
      .resolves(trackServiceStub.snippet_valid_track_list[1])

    sandbox
      .stub(artistModule.service, 'getRelatedArtistNameList')
      .callsFake(async function fakeFn() {
        return artistServiceStub.empty_related_artist_name_list
      })

    const fromDBUpdatedPlayed = sandbox
      .stub(trackModule.service, 'updateOnePlayed')
      .onFirstCall()
      .resolves(trackServiceStub.updateOnePlayed[0])
      .onSecondCall()
      .resolves(trackServiceStub.updateOnePlayed[1])

    const game = await gameModule.client.startGame({
      game_size: 2,
      url: 'start-game',
    })

    sinon.assert.callCount(getDbTrackListResponse, 1)
    sinon.assert.callCount(apiGetTrackList, 0)
    sinon.assert.callCount(apiGetSnippet, 0)
    sinon.assert.callCount(apiGetRelated, 2)

    assert.equal(game.length, 2)
    assert.exists(game[0].question)
    assert.exists(game[0].correct_answer)
    assert.exists(game[0].wrong_answers)

    assert.exists(game[1].question)
    assert.exists(game[1].correct_answer)
    assert.exists(game[1].wrong_answers)
  })
})
