import { gameClient } from './game.client'
import { gameController } from './game.controller'
import { gameHelper } from './game.helper'
import gameRouter from './game.routes'

export const gameModule = {
  client: gameClient,
  helper: gameHelper,
  // router: gameRouter,
  controller: gameController,
}
