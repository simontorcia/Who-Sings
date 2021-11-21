import { ITrackResponse } from '../interfaces/get_tracks.interface'
import { ITrack } from '../../../interfaces/track.type'
import { PLAYED_INIT_VALUE } from '../../../constants/constants'
// import { IRelatedArtistResponse } from '../interfaces/get_related_artists.interface'
import Logger from '../../../shared/logger.lib'

const getTracksResponseToITrackMapper = (
  page: string,
  track: ITrackResponse
): ITrack => {
  Logger.debug(
    `GetTracksMapper :: getTracksResponseToITrackMapper :: START with track:${JSON.stringify(
      track
    )}`
  )
  const iTrack: ITrack = {
    page,
    track_id: track.track_id,
    track_name: track.track_name,
    artist_id: track.artist_id,
    artist_name: track.artist_name,
    played: PLAYED_INIT_VALUE,
  }
  Logger.debug(
    `GetTracksMapper :: getTracksResponseToITrackMapper :: END with iTrack:${JSON.stringify(
      iTrack
    )}`
  )
  return iTrack
}

// const getRelatedArtistNameFromIArtistMapper = (
//   artist: IRelatedArtistResponse
// ): string => {
//   return artist.artist_name
// }

export const musixmatchApiMapper = {
  getTracksResponseToITrackMapper,
  // getRelatedArtistNameFromIArtistMapper,
}
