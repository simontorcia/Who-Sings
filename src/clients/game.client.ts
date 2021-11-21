import { gameHelper } from '../helpers/game.helper'
import {
  IStartGameRequest,
  IStartGameResponseItem,
} from '../interfaces/game.type'
import { trackHelper } from '../helpers/track.helper'
import Logger from '../shared/logger.lib'

const startGame = async (
  payload: IStartGameRequest,
  url: string
): Promise<IStartGameResponseItem[]> => {
  const { game_size } = payload

  Logger.debug(`GameClient :: startGame :: START with game_size:${game_size}`)

  const valid_track_list = await trackHelper.getValidTrackList(game_size)

  if (!valid_track_list) {
    return []
  }

  const game = await gameHelper.createGameEngine(
    game_size,
    valid_track_list,
    url
  )

  if (!game || game.length != game_size) {
    return []
  }
  Logger.debug(
    `GameClient :: startGame :: END with game:${JSON.stringify(game)}`
  )
  return game
}

export const gameClient = {
  startGame,
}
