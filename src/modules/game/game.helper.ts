import { ITrack } from '../track/track.type'
import { utilsLib } from '../../shared/utils'
import {
  GET_FILTERED_RANDOM_START,
  LAZY_START_GAME,
} from '../../constants/constants'
import Logger from '../../shared/logger.lib'
import { IStartGameRequest, IStartGameResponseItem } from './game.type'
import { trackModule } from '../../modules/track/track.module'
import { artistModule } from '../../modules/artist/artist.module'

const createGameEngine = async (
  payload: IStartGameRequest,
  valid_track_list: ITrack[]
): Promise<IStartGameResponseItem[]> => {
  const game: IStartGameResponseItem[] = []
  const random_indexes = []

  const { game_size, url } = payload

  Logger.debug(
    `GameHelper :: createGameEngine :: START game_size: ${game_size} and valid_track_list:${JSON.stringify(
      valid_track_list
    )}`
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

    const quiz = await createQuiz(random_index, valid_track_list, url)

    if (quiz) {
      game.push(quiz)
    }
    i++
  }
  Logger.debug(
    `GameHelper :: createGameEngine :: END game: ${JSON.stringify(game)}`
  )
  return game
}

const createQuiz = async (
  random_index: number,
  valid_track_list: ITrack[],
  url: string
): Promise<IStartGameResponseItem | null> => {
  const updated_track = await trackModule.helper.getUpdatedBySnippetTrack(
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
    Logger.debug(
      `GameHelper :: createGameEngine :: quiz: ${JSON.stringify(quiz)}`
    )
    // update played track
    await trackModule.service.updateOnePlayed(updated_track)

    return quiz
  }

  return null
}

const getWrongAnswers = async (
  url: string,
  track: ITrack
): Promise<string[]> => {
  try {
    Logger.debug(`GameHelper :: getWrongAnswers :: START `)
    return url.includes(LAZY_START_GAME)
      ? await artistModule.helper.getLazyArtistNameList(track)
      : await artistModule.helper.getRelatedArtistNameList(track)
  } catch (err) {
    Logger.debug(`GameHelper :: getWrongAnswers :: Err:${err} `)
    throw err
  }
}

export const gameHelper = {
  createGameEngine,
  getWrongAnswers,
}
