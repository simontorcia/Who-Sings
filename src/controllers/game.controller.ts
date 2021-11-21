import { Request, Response } from 'express'
import { gameClient } from '../clients/game.client'
import { validationResult } from 'express-validator'
import {
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_ERROR,
} from '../constants/http.status.constants'
import Logger from '../shared/logger.lib'
import { START_GAME } from '../constants/validator.constant'

const startGame = async (req: Request, res: Response) => {
  Logger.debug(`GameController :: startGame :: START`)

  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      Logger.error(`GameController :: startGame :: Validation errors:${errors}`)

      const errors_msg = errors.array({ onlyFirstError: true })
      return res.status(STATUS_BAD_REQUEST).json({ message: errors_msg[0].msg })
    }

    const url = req.url
    const { game_size } = req.body

    const game = await gameClient.startGame({
      game_size,
      url,
    })

    if (game.length === +game_size) {
      Logger.debug(
        `GameController :: startGame :: END game:${JSON.stringify(game)}`
      )
      return res.json(game)
    }
    Logger.debug(`GameController :: startGame :: END with GENERIC ERROR`)
    return res
      .status(STATUS_INTERNAL_ERROR)
      .json({ message: START_GAME.RESPONSE_GENERIC_ERROR })
  } catch (err) {
    Logger.error(`GameController :: startGame :: Error:${err}`)

    const message =
      err instanceof Error ? err.message : START_GAME.RESPONSE_GENERIC_ERROR
    return res.status(STATUS_INTERNAL_ERROR).json({ message })
  }
}

export const gameController = {
  startGame,
}
