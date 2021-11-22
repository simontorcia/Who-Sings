import { IStartGameRequest, IStartGameResponseItem } from './game.type'
import Logger from '../../shared/logger.lib'
import { gameModule } from './game.module'
import { trackModule } from '../../modules/track/track.module'

const startGame = async (
  payload: IStartGameRequest
): Promise<IStartGameResponseItem[]> => {
  const { game_size } = payload
  const game: IStartGameResponseItem[] = []

  Logger.debug(`GameClient :: startGame :: START with game_size:${game_size}`)

  const valid_track_list = await trackModule.helper.getValidTrackList(game_size)

  if (!valid_track_list) {
    return game
  }

  const created_game = await gameModule.helper.createGameEngine(
    payload,
    valid_track_list
  )
  if (created_game) {
    return created_game
  }
  Logger.debug(
    `GameClient :: startGame :: END with game:${JSON.stringify(game)}`
  )
  return game
}

export const gameClient = {
  startGame,
}
