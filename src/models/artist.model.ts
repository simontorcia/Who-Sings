import { IArtist } from './../interfaces/artist.type'
import { Schema, model } from 'mongoose'

export const ArtistSchema = new Schema(
  {
    artist_id: {
      type: Number,
      unique: true,
      required: true,
    },
    artist_name: { type: String },
    related_artist_names: { type: [String], default: [] },
  },
  { versionKey: false }
)

const Artist = model<IArtist>('Artist', ArtistSchema)

export default Artist
