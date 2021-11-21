export interface ITrack {
  _id?: string
  track_id: number
  track_name: string
  artist_id: number
  artist_name: string
  played: number
  snippet?: string
  page: string
}
