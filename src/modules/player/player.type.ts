export interface IPlayer {
  name: string
  scores: number[]
  // max_score: number
}
export interface IGetHighScoresRequest {
  player_name: string
}

export interface IGetHighScoresResponse {
  player_name: string
  high_scores: number[]
}

export interface ISaveScoreRequest {
  player_name: string
  score: number
}
export interface ISaveScoreResponse {
  player_name: string
  score: number
}

export interface IGetLeaderboardItemResponse {
  player_name: string
  max_score: number
}

export interface IGetLeaderboardResponse {
  leaderboard: IGetLeaderboardItemResponse[]
}
