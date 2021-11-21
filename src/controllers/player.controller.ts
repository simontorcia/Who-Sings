import { Request, Response } from 'express'
import { playerClient } from '../clients/player.client'
import { validationResult } from 'express-validator'
import {
  STATUS_BAD_REQUEST,
  STATUS_INTERNAL_ERROR,
  STATUS_NOT_FOUND,
} from '../constants/http.status.constants'
import {
  GET_HIGH_SCORE,
  GET_LEADERBOARD,
  SAVE_SCORE,
} from '../constants/validator.constant'
import Logger from '../shared/logger.lib'

const getHighScores = async (req: Request, res: Response) => {
  Logger.debug(`PlayerController :: getHighScores :: START`)

  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      Logger.error(
        `PlayerController :: getHighScores :: Validation errors:${errors}`
      )
      const errors_msg = errors.array({ onlyFirstError: true })
      return res.status(STATUS_BAD_REQUEST).json({ message: errors_msg[0].msg })
    }

    const { player_name } = req.query

    const high_scores_response = await playerClient.getHighScores({
      player_name: '' + player_name,
    })

    if (high_scores_response.high_scores.length === 0) {
      return res.status(STATUS_NOT_FOUND).json({
        message: `${GET_HIGH_SCORE.STATUS_NOT_FOUND_MESSAGE} ${player_name}`,
      })
    }

    Logger.debug(
      `PlayerController :: getHighScores :: END high_scores_response:${JSON.stringify(
        high_scores_response
      )}`
    )

    return res.json(high_scores_response)
  } catch (err) {
    Logger.error(`PlayerController :: getHighScores :: Error:${err}`)
    const message =
      err instanceof Error ? err.message : GET_HIGH_SCORE.RESPONSE_GENERIC_ERROR
    return res.status(STATUS_INTERNAL_ERROR).json({ message })
  }
}

const getLeaderboard = async (req: Request, res: Response) => {
  Logger.debug(`PlayerController :: getLeaderboard :: START`)

  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      Logger.error(
        `PlayerController :: getLeaderboard :: Validation errors:${errors}`
      )
      const errors_msg = errors.array({ onlyFirstError: true })
      return res.status(STATUS_BAD_REQUEST).json({ message: errors_msg[0].msg })
    }
    const leaderBoard_response = await playerClient.getLeaderboard()
    Logger.debug(
      `PlayerController :: getLeaderboard :: END with leaderBoard_response:${JSON.stringify(
        leaderBoard_response
      )}`
    )

    if (leaderBoard_response.leaderboard.length === 0) {
      return res.json({
        message: `${GET_LEADERBOARD.RESPONSE_EMPTY}`,
      })
    }
    return res.json(leaderBoard_response)
  } catch (err) {
    Logger.error(`PlayerController :: getLeaderboard :: Error:${err}`)
    const message =
      err instanceof Error
        ? err.message
        : GET_LEADERBOARD.RESPONSE_GENERIC_ERROR
    return res.status(STATUS_INTERNAL_ERROR).json({ message })
  }
}

const saveScore = async (req: Request, res: Response) => {
  Logger.debug(`PlayerController :: saveScore :: START`)
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      Logger.error(
        `PlayerController :: saveScore :: Validation errors:${errors}`
      )
      const errors_msg = errors.array({ onlyFirstError: true })
      return res.status(STATUS_BAD_REQUEST).json({ message: errors_msg[0].msg })
    }

    const { score, player_name } = req.body
    const save_score_response = await playerClient.saveScore({
      score,
      player_name,
    })

    Logger.debug(
      `PlayerController :: saveScore :: END with save_score_response:${JSON.stringify(
        save_score_response
      )} `
    )

    return res.json(save_score_response)
  } catch (err) {
    Logger.error(`PlayerController :: saveScore :: Error:${err}`)
    const message =
      err instanceof Error ? err.message : SAVE_SCORE.RESPONSE_GENERIC_ERROR
    return res.status(STATUS_INTERNAL_ERROR).json({ message })
  }
}

export const playerController = {
  getLeaderboard,
  getHighScores,
  saveScore,
}
