import { utilsLib } from '../shared/utils'
import {
  IPlayer,
  ISaveScoreResponse,
  ISaveScoreRequest,
  IGetHighScoresRequest,
  IGetHighScoresResponse,
  IGetLeaderboardResponse,
} from '../interfaces/player.type'
import { playerService } from '../services/player.service'
import Logger from '../shared/logger.lib'

const getHighScores = async (
  payload: IGetHighScoresRequest
): Promise<IGetHighScoresResponse> => {
  const { player_name } = payload
  Logger.debug(
    `PlayerClient :: getHighScores :: INIT with player_name:${player_name}`
  )
  const high_scores = await playerService.getHighScores(player_name)

  if (!high_scores) {
    throw new Error('PLAYER_CLIENT::GET_HIGH_SCORES::HIGH_SCORES_NULL')
  }

  const result = {
    player_name: player_name,
    high_scores: utilsLib.removeDuplicatesFromNumberList(high_scores),
  }

  Logger.debug(
    `PlayerClient :: getHighScores :: END with result:${JSON.stringify(result)}`
  )
  return result
}

const getLeaderboard = async (): Promise<IGetLeaderboardResponse> => {
  Logger.debug(`PlayerClient :: getLeaderboard :: START`)

  const leaderboard = await playerService.getLeaderboard()
  if (!leaderboard) {
    throw new Error('PLAYER_CLIENT::GET_LEADERBOARD::LEADERBOARD_NULL')
  }
  Logger.debug(
    `PlayerClient :: getLeaderboard :: END with leaderboard:${JSON.stringify(
      leaderboard
    )}`
  )

  return { leaderboard }
}

const saveScore = async (
  payload: ISaveScoreRequest
): Promise<ISaveScoreResponse> => {
  const { player_name, score } = payload
  Logger.debug(
    `PlayerClient :: saveScore :: START with player_name:${player_name} and score:${score}`
  )

  const scores = [score]
  const updated_player = await playerService.upsertPlayer(player_name, scores)

  if (!updated_player) {
    throw new Error('PLAYER_CLIENT::SAVE_SCORE::UPDATED_PLAYER_NULL')
  }

  if (updated_player.max_score < score) {
    Logger.debug(`PlayerClient :: saveScore :: Update Max Score`)
    const player = await updateMaxScore(score, updated_player.name)
    if (player) {
      return { player_name: player.name, score }
    }
  }
  const result = { player_name: updated_player.name, score }
  Logger.debug(
    `PlayerClient :: saveScore :: END with result:${JSON.stringify(result)}`
  )

  return result
}

const updateMaxScore = async (
  score: number,
  name: string
): Promise<IPlayer> => {
  Logger.debug(
    `PlayerClient :: updateMaxScore :: START for score:${score} and name:${name}`
  )
  const updated_player = await playerService.updateMaxScore(score, name)

  if (!updated_player) {
    throw new Error('PLAYER_CLIENT::GET_HIGH_SCORES::HIGH_SCORES_NULL')
  }
  Logger.debug(
    `PlayerClient :: updateMaxScore :: END  updated_player:${updated_player}`
  )
  return updated_player
}

export const playerClient = {
  getLeaderboard,
  getHighScores,
  saveScore,
}
