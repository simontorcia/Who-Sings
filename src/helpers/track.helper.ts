import { utilsLib } from '../shared/utils'
import { musixmatchService } from '../external_services/musixmatch/musixmatch.service'
import { ITrack } from '../interfaces/track.type'
import { trackService } from '../services/track.service'
import { artistHelper } from './artist.helper'
import {
  CHECK_TRACK_LIST_SIZE,
  MAX_API_PAGE,
  MIN_API_PAGE,
  PLAYED_INIT_VALUE,
  ERROR_NOT_VALID_SNIPPET,
} from '../constants/constants'
import Logger from '../shared/logger.lib'

const addSnippetToTrack = async (track: ITrack): Promise<ITrack | null> => {
  try {
    Logger.debug(`TrackHelper :: addSnippetToTrack :: START track:${track}`)

    const snippet = await musixmatchService.getSnippetByTrackId(track.track_id)

    const updated_track = await trackService.addSnippetIntoTrack(track, snippet)

    if (!updated_track) {
      return null
    }

    if (snippet === ERROR_NOT_VALID_SNIPPET) {
      // UPDATE FLAG
      const snippet_error_track = await trackService.updateOnePlayed(
        updated_track
      )
      return null
    }
    Logger.debug(
      `TrackHelper :: addSnippetToTrack :: END updated_track:${updated_track} `
    )
    return updated_track
  } catch (err) {
    Logger.debug(`TrackHelper :: addSnippetToTrack :: err: ${err}`)
    throw err
  }
}

const checkOnTrackSnippet = (track: ITrack): boolean => {
  Logger.debug(
    `TrackHelper :: checkOnTrackSnippet :: START track:${JSON.stringify(track)}`
  )
  return !!track && !!track.snippet && track.snippet !== ERROR_NOT_VALID_SNIPPET
}

const createTrackList = async (game_size: number, random_page: string) => {
  try {
    Logger.debug(
      `TrackHelper :: createTrackList :: START game_size:${game_size} and random_page:${random_page}`
    )
    const api_track_list = await musixmatchService.getTrackList(
      random_page,
      game_size
    )

    await trackService.createTrackList(api_track_list)
    await artistHelper.createArtistListFromTrackList(api_track_list)
  } catch (err) {
    Logger.debug(`TrackHelper :: createTrackList :: err: ${err}`)
    throw err
  }
}

const getPlayedValue = async (used_pages: string[]) => {
  try {
    Logger.debug(
      `TrackHelper :: getPlayedValue :: START used_pages:${used_pages}`
    )
    let played = PLAYED_INIT_VALUE

    if (used_pages && used_pages.length === MAX_API_PAGE) {
      Logger.debug(
        `TrackHelper :: getPlayedValue :: used_pages.length === ${MAX_API_PAGE}`
      )
      const min_played = await trackService.getMinPlayed()
      if (min_played) {
        played = min_played
      }
    }
    Logger.debug(`TrackHelper :: getPlayedValue :: END played: ${played}`)
    return played
  } catch (err) {
    Logger.debug(`TrackHelper :: getPlayedValue :: err: ${err}`)
    throw err
  }
}

const getUpdatedTrackList = async (
  used_pages: string[],
  game_size: number,
  played: number
): Promise<ITrack[]> => {
  try {
    Logger.debug(
      `TrackHelper :: getUpdatedTrackList :: START used_pages:${used_pages} and game_size:${game_size} and played:${played}`
    )
    const random_page = utilsLib.getFilteredRandomPage(
      MIN_API_PAGE,
      MAX_API_PAGE,
      used_pages
    )

    await createTrackList(game_size, random_page)

    const updated_track_list = await trackService.getValidTrackList(played)

    if (!updated_track_list) {
      return []
    }
    Logger.debug(
      `TrackHelper :: getUpdatedTrackList :: END updated_track_list:${JSON.stringify(
        updated_track_list
      )}`
    )
    return updated_track_list
  } catch (err) {
    Logger.debug(`TrackHelper :: getUpdatedTrackList :: err: ${err}`)
    throw err
  }
}

const getValidTrackList = async (game_size: number): Promise<ITrack[]> => {
  try {
    Logger.debug(
      `TrackHelper :: getValidTrackList :: START game_size:${game_size}`
    )

    const used_pages = await trackService.getUsedPages()

    const played = used_pages
      ? await getPlayedValue(used_pages)
      : PLAYED_INIT_VALUE

    const db_valid_track_list = await trackService.getValidTrackList(played)

    if (!db_valid_track_list) {
      return []
    }
    // CHECK IF ALREADY GETTED ALL PAGES FROM API
    if (
      used_pages &&
      used_pages.length < 100 &&
      checkTrackListSize(db_valid_track_list, game_size)
    ) {
      return getUpdatedTrackList(used_pages, game_size, played)
    }
    Logger.debug(
      `TrackHelper :: getValidTrackList :: START db_valid_track_list:${JSON.stringify(
        db_valid_track_list
      )}`
    )
    return db_valid_track_list
  } catch (err) {
    Logger.debug(`TrackHelper :: getValidTrackList :: err: ${err}`)
    throw err
  }
}

const checkTrackListSize = (
  track_list: ITrack[],
  game_size: number
): boolean => {
  Logger.debug(`TrackHelper :: checkTrackListSize :: START`)
  return (
    track_list.length < game_size ||
    (track_list.length >= game_size &&
      track_list.length < CHECK_TRACK_LIST_SIZE * (game_size + 1))
  )
}

const getUpdatedBySnippetTrack = async (
  track: ITrack
): Promise<ITrack | null> => {
  try {
    Logger.debug(
      `TrackHelper :: getUpdatedBySnippetTrack :: START track:${track}`
    )
    return !checkOnTrackSnippet(track) ? await addSnippetToTrack(track) : track
  } catch (err) {
    console.log(`TRACK_HELPER::GET_UPDATED_BY_SNIPPET_TRACK::ERR: ${err}`)
    throw err
  }
}

export const trackHelper = {
  addSnippetToTrack,
  createTrackList,
  checkOnTrackSnippet,
  getValidTrackList,
  getUpdatedBySnippetTrack,
}
