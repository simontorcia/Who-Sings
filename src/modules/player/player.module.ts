import { playerClient } from './player.client'
import { playerController } from './player.controller'
import Player from './player.model'
import playerRouter from './player.routes'
import { playerService } from './player.service'

export const playerModule = {
  client: playerClient,
  service: playerService,
  // router: playerRouter,
  controller: playerController,
  model: Player,
}
