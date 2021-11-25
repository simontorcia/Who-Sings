// GAME: punteggio (totale somma quiz), player

import { Schema, model } from 'mongoose'
import { IPlayer } from './player.type'
import { PLAYER_MAX_SCORE_INIT } from '../../constants/constants'

export const PlayerSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Field is required'],
    },
    // max_score: { type: Number, default: PLAYER_MAX_SCORE_INIT },
    scores: { type: [Number], default: [] },
  },
  { versionKey: false }
)

const Player = model<IPlayer>('Player', PlayerSchema)

export default Player
