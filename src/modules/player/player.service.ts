import { IGetLeaderboardItemResponse, IPlayer } from './player.type'
import {
  GET_LEADERDBOARD_SORT_DIRECTION,
  GET_LEADERDBOARD_LIMIT,
  NEW_SCORES_SORT_DIRECTION,
  GET_HIGH_SCORES_HIGH_SCORES_LIMIT,
  GET_HIGH_SCORES_SCORES_SORT_DIRECTION,
} from '../../constants/constants'
import Logger from '../../shared/logger.lib'
import { playerModule } from './player.module'

const upsertPlayer = async (
  name: string,
  score: number
): Promise<IPlayer | null> => {
  Logger.debug(`PlayerService :: upsertPlayer :: START`)
  try {
    return playerModule.model.findOneAndUpdate(
      { name },
      {
        // $max: {
        //   max_score: score,
        // },
        $push: {
          scores: { $each: [score], $sort: NEW_SCORES_SORT_DIRECTION },
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    )
  } catch (err) {
    Logger.error(`PlayerService :: upsertPlayer :: Err:${err}`)
    throw new Error(`ERROR ON PLAYER ${name} UPSERT`)
  }
}

// const updateMaxScore = async (
//   score: number,
//   name: string
// ): Promise<IPlayer | null> => {
//   Logger.debug(`PlayerService :: updateMaxScore :: START`)
//   try {
//     return playerModule.model.findOneAndUpdate({ name }, { max_score: score })
//   } catch (err) {
//     Logger.error(`PlayerService :: updateMaxScore :: Err:${err}`)
//     throw new Error(`ERROR ON UPDATE MAX SCORE`)
//   }
// }

const getHighScores = async (name: string): Promise<number[] | null> => {
  Logger.debug(`PlayerService :: getHighScores :: START`)
  let high_scores: number[] = []
  try {
    const player = await playerModule.model
      .findOne({ name }, 'scores', {
        sort: { scores: GET_HIGH_SCORES_SCORES_SORT_DIRECTION },
      })
      .limit(GET_HIGH_SCORES_HIGH_SCORES_LIMIT)
    if (player) {
      high_scores = [...high_scores, ...player.scores]
    }
    return high_scores
  } catch (err) {
    Logger.error(`PlayerService :: getHighScores :: Err:${err}`)
    throw new Error(`USER ${name} DOES NOT EXIST`)
  }
}

// const getLeaderboard = async (): Promise<
//   IGetLeaderboardItemResponse[] | null
// > => {
//   Logger.debug(`PlayerService :: getLeaderboard :: START`)
//   let leaderboard: IGetLeaderboardItemResponse[] = []
//   try {
//     leaderboard = [
//       ...leaderboard,
//       ...(await playerModule.model.aggregate([
//         { $unset: ['_id', 'scores'] },
//         { $sort: { max_score: GET_LEADERDBOARD_SORT_DIRECTION } },
//         { $limit: GET_LEADERDBOARD_LIMIT },
//       ])),
//     ]
//     return leaderboard
//   } catch (err) {
//     Logger.error(`PlayerService :: getLeaderboard :: Err:${err}`)
//     throw new Error(`GET_LEADERBOAD ERROR ${err}`)
//   }
// }

const getLeaderboardRefactoring = async (): Promise<
  IGetLeaderboardItemResponse[] | null
> => {
  Logger.debug(`PlayerService :: getLeaderboard :: START`)
  try {
    return playerModule.model.aggregate([
      { $project: { _id: 0, name: 1, max_score: { $max: '$scores' } } },
      { $sort: { max_score: GET_LEADERDBOARD_SORT_DIRECTION } },
      { $limit: GET_LEADERDBOARD_LIMIT },
    ])
  } catch (err) {
    Logger.error(`PlayerService :: getLeaderboard :: Err:${err}`)
    throw new Error(`GET_LEADERBOAD ERROR ${err}`)
  }
}

export const playerService = {
  // updateMaxScore,
  getHighScores,
  // getLeaderboard,
  getLeaderboardRefactoring,
  upsertPlayer,
}
