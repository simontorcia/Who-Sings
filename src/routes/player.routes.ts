import { Router } from 'express'
import { playerController } from '../controllers/player.controller'
import { authMiddleware } from '../middleware/auth'
import { body, query } from 'express-validator'
import {
  GET_HIGH_SCORE,
  GET_LEADERBOARD,
  SAVE_SCORE,
  SAVE_SCORE_SIZE_CUSTOM,
} from '../constants/validator.constant'

export class PlayerRouter {
  router: Router

  constructor() {
    this.router = Router()
    this.initRouter()
  }

  initRouter() {
    this.router.post(
      '/savescore',
      authMiddleware.checkApiKey,
      body('player_name')
        .exists()
        .notEmpty()
        .withMessage(SAVE_SCORE.PLAYER_NAME_REQUIRED)
        .isString()
        .withMessage(SAVE_SCORE.PLAYER_NAME_WRONG_TYPE),
      body('score')
        .exists()
        .withMessage(SAVE_SCORE.SCORE_REQUIRED)
        .notEmpty()
        .withMessage(SAVE_SCORE.SCORE_REQUIRED)
        .isNumeric()
        .withMessage(SAVE_SCORE.SCORE_WRONG_TYPE)
        .custom(
          (value) =>
            value <= SAVE_SCORE.MAX_VALUE && value >= SAVE_SCORE.MIN_VALUE
        )
        .withMessage(SAVE_SCORE_SIZE_CUSTOM),
      playerController.saveScore
    )
    this.router.get(
      '/high-scores',
      authMiddleware.checkApiKey,
      query('player_name')
        .exists()
        .withMessage(GET_HIGH_SCORE.PLAYER_NAME_REQUIRED)
        .notEmpty()
        .withMessage(GET_HIGH_SCORE.PLAYER_NAME_REQUIRED)
        .isString()
        .withMessage(GET_HIGH_SCORE.PLAYER_NAME_WRONG_TYPE),
      playerController.getHighScores
    )
    this.router.get(
      '/leaderboard',
      authMiddleware.checkApiKey,
      playerController.getLeaderboard
    )
  }
}

export default new PlayerRouter().router
