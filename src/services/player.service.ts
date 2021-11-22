import Player from '../models/player.model'
import { IGetLeaderboardItemResponse, IPlayer } from '../interfaces/player.type'
import {
  GET_LEADERDBOARD_SORT_DIRECTION,
  GET_LEADERDBOARD_LIMIT,
} from '../constants/constants'
import Logger from '../shared/logger.lib'

const upsertPlayer = async (
  name: string,
  new_scores: number[]
): Promise<IPlayer | null> => {
  Logger.debug(`PlayerService :: upsertPlayer :: START`)
  try {
    const player = await Player.findOneAndUpdate(
      { name },
      {
        $push: { scores: { $each: new_scores, $sort: -1 } },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    )

    return player
  } catch (err) {
    Logger.error(`PlayerService :: upsertPlayer :: Err:${err}`)
    throw new Error(`ERROR ON PLAYER ${name} UPSERT`)
  }
}

const updateMaxScore = async (
  score: number,
  name: string
): Promise<IPlayer | null> => {
  Logger.debug(`PlayerService :: updateMaxScore :: START`)
  try {
    return Player.findOneAndUpdate({ name }, { max_score: score })
  } catch (err) {
    Logger.error(`PlayerService :: updateMaxScore :: Err:${err}`)
    throw new Error(`ERROR ON UPDATE MAX SCORE`)
  }
}

const getHighScores = async (name: string): Promise<number[] | null> => {
  Logger.debug(`PlayerService :: getHighScores :: START`)
  let high_scores: number[] = []
  try {
    const player = await Player.findOne({ name }, 'scores', {
      sort: { scores: 1 },
    }).limit(10)
    if (player) {
      high_scores = [...high_scores, ...player.scores]
    }
    return high_scores
  } catch (err) {
    Logger.error(`PlayerService :: getHighScores :: Err:${err}`)
    throw new Error(`USER ${name} DOES NOT EXIST`)
  }
}

const getLeaderboard = async (): Promise<
  IGetLeaderboardItemResponse[] | null
> => {
  Logger.debug(`PlayerService :: getLeaderboard :: START`)
  let leaderboard: IGetLeaderboardItemResponse[] = []
  try {
    leaderboard = [
      ...leaderboard,
      ...(await Player.aggregate([
        { $unset: ['_id', 'scores'] },
        { $sort: { max_score: GET_LEADERDBOARD_SORT_DIRECTION } },
        { $limit: GET_LEADERDBOARD_LIMIT },
      ])),
    ]
    return leaderboard
  } catch (err) {
    Logger.error(`PlayerService :: getLeaderboard :: Err:${err}`)
    throw new Error(`GET_LEADERBOAD ERROR ${err}`)
  }
}

export const playerService = {
  updateMaxScore,
  getHighScores,
  getLeaderboard,
  upsertPlayer,
}
