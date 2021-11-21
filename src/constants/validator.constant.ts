import { GAME_SIZE_MAX, GAME_SIZE_MIN } from './constants'

export const GET_HIGH_SCORE = {
  PLAYER_NAME_REQUIRED: 'player_name is required',
  PLAYER_NAME_WRONG_TYPE: 'player_name must be a string',
  RESPONSE_GENERIC_ERROR: 'ERROR GETTING THE HIGH SCORES, PLEASE RETRY',
  STATUS_NOT_FOUND_MESSAGE:'No scores found for user: '
}

export const GET_LEADERBOARD = {
  RESPONSE_GENERIC_ERROR: 'ERROR GETTING THE LEADERBOARD, PLEASE RETRY',
}

export const SAVE_SCORE = {
  MIN_VALUE: 1,
  MAX_VALUE: 1000,
  PLAYER_NAME_REQUIRED: 'player_name is required',
  PLAYER_NAME_WRONG_TYPE: 'player_name must be a string',
  SCORE_REQUIRED: 'score is required',
  SCORE_WRONG_TYPE: 'score must be a number',
  RESPONSE_GENERIC_ERROR: 'ERROR SAVING THE SCORE, PLEASE RETRY',
}

export const SAVE_SCORE_SIZE_CUSTOM = `score is a number between ${SAVE_SCORE.MIN_VALUE} and ${SAVE_SCORE.MAX_VALUE}`

export const START_GAME = {
  GAME_SIZE_REQUIRED: 'game_size is required',
  GAME_SIZE_WRONG_TYPE: 'game_size must be a number',
  RESPONSE_GENERIC_ERROR: 'ERROR STARTING THE GAME, PLEASE RETRY',
  SIZE_CUSTOM: `game_size is a number between ${GAME_SIZE_MIN} and ${GAME_SIZE_MAX}`,
}
