import { trackHelper } from './track.helper'
import { artistHelper } from './artist.helper'
import { trackService } from '../services/track.service'
import { ITrack } from '../interfaces/track.type'
import { utilsLib } from '../shared/utils'
import {
  GET_FILTERED_RANDOM_START,
  LAZY_START_GAME,
} from '../constants/constants'
import Logger from '../shared/logger.lib'
import { IStartGameResponseItem } from '../interfaces/game.type'

const createGameEngine = async (
  game_size: number,
  valid_track_list: ITrack[],
  url: string
): Promise<IStartGameResponseItem[]> => {
  const game: IStartGameResponseItem[] = []
  const to_update_tracks = []
  const random_indexes = []

  Logger.debug(
    `GameHelper :: createGameEngine :: START game_size: ${game_size} and valid_track_list:${JSON.stringify(valid_track_list)}`
  )

  let i = 0
  while (game.length < game_size && i < valid_track_list.length) {
    const random_index = utilsLib.getFilterdRandomNumberInRange(
      GET_FILTERED_RANDOM_START,
      valid_track_list.length - 1,
      random_indexes
    )

    random_indexes.push(random_index)

    Logger.debug(
      `GameHelper :: createGameEngine :: random_index: ${random_index}`
    )

    const updated_track = await trackHelper.getUpdatedBySnippetTrack(
      valid_track_list[random_index]
    )

    const wrong_answers = await getWrongAnswers(
      url,
      valid_track_list[random_index]
    )

    if (updated_track && !!updated_track.snippet && wrong_answers.length > 0) {
      const quiz = {
        question: updated_track.snippet,
        correct_answer: updated_track.artist_name,
        wrong_answers,
      }
      Logger.debug(`GameHelper :: createGameEngine :: quiz: ${JSON.stringify(quiz)}`)
      game.push(quiz)

      to_update_tracks.push(updated_track)
    }

    i++
  }

  if (game.length === game_size) {
    await trackService.updateManyPlayed(to_update_tracks)
  }
  Logger.debug(
    `GameHelper :: createGameEngine :: END game: ${JSON.stringify(game)}`
  )
  return game
}

const getWrongAnswers = async (
  url: string,
  track: ITrack
): Promise<string[]> => {
  Logger.debug(`GameHelper :: getWrongAnswers :: START `)
  try {
    return url.includes(LAZY_START_GAME)
      ? await artistHelper.getLazyArtistNameList(track)
      : await artistHelper.getRelatedArtistNameList(track)
  } catch (err) {
    Logger.error(`GameHelper :: getWrongAnswers :: Err:${err} `)
    throw err
  }
}

export const gameHelper = {
  createGameEngine,
}
