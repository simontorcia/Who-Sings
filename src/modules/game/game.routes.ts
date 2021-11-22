import { Router } from 'express'
import { gameModule } from './game.module'
import { authMiddleware } from '../../middleware/auth'
import { body } from 'express-validator'
import { GAME_SIZE_MIN, GAME_SIZE_MAX } from '../../constants/constants'
import { START_GAME } from '../../constants/validator.constant'

export class GameRouter {
  router: Router

  constructor() {
    this.router = Router()
    this.initRouter()
  }

  initRouter() {
    this.router.post(
      '/start-game',
      authMiddleware.checkApiKey,
      body('game_size')
        .exists()
        .withMessage(START_GAME.GAME_SIZE_REQUIRED)
        .notEmpty()
        .withMessage(START_GAME.GAME_SIZE_REQUIRED)
        .isNumeric()
        .withMessage(START_GAME.GAME_SIZE_WRONG_TYPE)
        .custom((value) => value > GAME_SIZE_MIN && value < GAME_SIZE_MAX)
        .withMessage(START_GAME.SIZE_CUSTOM),
      gameModule.controller.startGame
    )

    this.router.post(
      '/lazy-start-game',
      authMiddleware.checkApiKey,
      body('game_size')
        .exists()
        .withMessage(START_GAME.GAME_SIZE_REQUIRED)
        .notEmpty()
        .withMessage(START_GAME.GAME_SIZE_REQUIRED)
        .isNumeric()
        .withMessage(START_GAME.GAME_SIZE_WRONG_TYPE)
        .custom((value) => value > GAME_SIZE_MIN && value < GAME_SIZE_MAX)
        .withMessage(START_GAME.SIZE_CUSTOM),
      gameModule.controller.startGame
    )
  }
}

export default new GameRouter().router
