import { gameHelper } from '../helpers/game.helper'
import {
  IStartGameRequest,
  IStartGameResponseItem,
} from '../interfaces/game.type'
import { trackHelper } from '../helpers/track.helper'
import Logger from '../shared/logger.lib'

const startGame = async (
  payload: IStartGameRequest
): Promise<IStartGameResponseItem[]> => {
  const { game_size } = payload

  Logger.debug(`GameClient :: startGame :: START with game_size:${game_size}`)

  const valid_track_list = await trackHelper.getValidTrackList(game_size)

  if (!valid_track_list) {
    throw new Error('GAME_CLIENT::START_GAME::TRACK_LIST_NOT_VALID')
  }

  const game = await gameHelper.createGameEngine(payload, valid_track_list)
  if (!game) {
    throw new Error('GAME_CLIENT::START_GAME::GAME_NOT_CREATED')
  }
  Logger.debug(
    `GameClient :: startGame :: END with game:${JSON.stringify(game)}`
  )
  return game
}

export const gameClient = {
  startGame,
}
