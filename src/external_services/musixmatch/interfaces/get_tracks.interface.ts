export interface ITrackResponse {
  track_id: number
  track_name: string
  artist_id: number
  artist_name: string
}

export interface ITrackListResponse {
  track: ITrackResponse
}
