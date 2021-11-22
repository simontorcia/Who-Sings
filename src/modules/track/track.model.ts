import { PLAYED_INIT_VALUE } from '../../constants/constants'
import { model, Schema } from 'mongoose'
import { ITrack } from './track.type'

export const TrackSchema = new Schema(
  {
    track_id: {
      type: Number,
      unique: true,
      required: true,
    },
    track_name: { type: String },
    artist_id: { type: Number },
    artist_name: { type: String },
    snippet: { type: String, default: '' },
    played: { type: Number, default: PLAYED_INIT_VALUE },
    page: { type: String },
  },
  { versionKey: false }
)

const Track = model<ITrack>('Track', TrackSchema)

export default Track
