import { request } from 'undici'
import {
  ORIGIN,
  GET_TRACKS_CONFIG,
  GET_SNIPPET,
  GET_RELATED_ARTISTS,
} from './config/musixmatch.config'
import { ITrackListResponse } from './interfaces/get_tracks.interface'
import { IRelatedArtistListResponse } from './interfaces/get_related_artists.interface'
import { musixmatchApiMapper } from './mappers/get_tracks.mapper'
import { ITrack } from '../../interfaces/track.type'
import { ERROR_NOT_VALID_SNIPPET } from '../../constants/constants'
import { STATUS_SUCCESS } from '../../constants/http.status.constants'
import Logger from '../../shared/logger.lib'
import { IArtist } from 'interfaces/artist.type'

const getTrackList = async (
  page: string,
  game_size: number
): Promise<ITrack[] | []> => {
  const new_track_list: ITrack[] = []
  try {
    Logger.debug(`MusixmatchService :: getTrackList :: START`)

    const apikey = process.env.MUSIXMATCH_APIKEY
    const { page_size_conf, f_has_lyrics, uri } = GET_TRACKS_CONFIG
    const page_size = Math.max(page_size_conf, game_size)
    const url = `${ORIGIN}${uri}?apikey=${apikey}&page=${page}&page_size=${page_size}&f_has_lyrics=${f_has_lyrics}`
    const { body } = await request(url)
    const json = await body.json()
    const { status_code } = json.message.header

    Logger.debug(
      `MusixmatchService :: getTrackList :: status_code:${status_code}`
    )
    if (status_code === STATUS_SUCCESS) {
      const { track_list } = json.message.body
      track_list.forEach((track: ITrackListResponse) =>
        new_track_list.push(
          musixmatchApiMapper.getTracksResponseToITrackMapper(page, track.track)
        )
      )
    }
    Logger.debug(
      `MusixmatchService :: getTrackList :: END with new_track_list:${JSON.stringify(
        new_track_list
      )}`
    )
    return new_track_list
  } catch (err) {
    Logger.error(`MusixmatchService :: getTrackList :: Error:${err}`)
    throw new Error(`MUSIXMATCH_SERVICE::GET_TRACK_LIST`)
  }
}

const getSnippetByTrackId = async (track_id: number): Promise<string> => {
  Logger.debug(`MusixmatchService :: getSnippetByTrackId :: START`)
  try {
    const apikey = process.env.MUSIXMATCH_APIKEY
    const { uri } = GET_SNIPPET
    const url = `${ORIGIN}${uri}?track_id=${track_id}&apikey=${apikey}`
    const { body } = await request(url)
    const json = await body.json()
    const { status_code } = json.message.header

    Logger.debug(
      `MusixmatchService :: getSnippetByTrackId :: status_code:${status_code}`
    )

    if (status_code === STATUS_SUCCESS) {
      const { snippet_body } = json.message.body.snippet
      if (snippet_body && snippet_body !== '') {
        Logger.debug(
          `MusixmatchService :: getSnippetByTrackId :: snippet_body:${snippet_body}`
        )
        return snippet_body
      }
    }
    Logger.debug(
      `MusixmatchService :: getSnippetByTrackId :: snippet_body:${ERROR_NOT_VALID_SNIPPET}`
    )
    return ERROR_NOT_VALID_SNIPPET
  } catch (err) {
    Logger.error(`MusixmatchService :: getSnippetByTrackId :: Error:${err}`)
    throw new Error(`MUSIXMATCH_SERVICE::GET_SNIPPET_ERR`)
  }
}

const getRelatedArtistList = async (artist_id: number): Promise<IArtist[]> => {
  Logger.debug(`MusixmatchService :: getRelatedArtistList :: START`)
  const related_artist_list: IArtist[] = []

  try {
    const apikey = process.env.MUSIXMATCH_APIKEY
    const { uri, page, page_size, format } = GET_RELATED_ARTISTS
    const url = `${ORIGIN}${uri}?apikey=${apikey}&artist_id=${artist_id}&page_size=${page_size}&page=${page}&format=${format}`
    const { body } = await request(url)
    const json = await body.json()
    const { status_code } = json.message.header

    Logger.debug(
      `MusixmatchService :: getRelatedArtistList :: status_code:${status_code}`
    )

    if (status_code === STATUS_SUCCESS) {
      const { artist_list } = json.message.body

      artist_list.forEach((artist: IRelatedArtistListResponse) =>
        related_artist_list.push({
          artist_id: artist.artist.artist_id,
          artist_name: artist.artist.artist_name,
          related_artist_names: [],
        })
      )
    }
    Logger.debug(
      `MusixmatchService :: getRelatedArtistList :: END related_artist_list: ${JSON.stringify(
        related_artist_list
      )}`
    )
    return related_artist_list
  } catch (err) {
    Logger.error(`MusixmatchService :: getRelatedArtistList :: Error:${err}`)
    throw new Error(`MUSIXMATCH_SERVICE::GET_RELATED_ARTIST_LIST_ERR`)
  }
}

export const musixmatchService = {
  getTrackList,
  getSnippetByTrackId,
  getRelatedArtistList,
}
