import { IArtist } from '../interfaces/artist.type'
import { ITrack } from '../interfaces/track.type'
import { musixmatchService } from '../external_services/musixmatch/musixmatch.service'
import { artistService } from '../services/artist.service'
import {
  RELATED_ARTIST_LIST_SIZE,
  RELATED_ARTIST_LIST_START,
} from '../constants/constants'
import Logger from '../shared/logger.lib'

const getRelatedArtistNameList = async (track: ITrack): Promise<string[]> => {
  try {
    const { artist_id } = track
    Logger.debug(
      `ArtistHelper :: getRelatedArtistNameList :: START artist_id: ${artist_id}`
    )

    let related_artist_list = await artistService.getRelatedArtistNameList(
      artist_id
    )

    if (
      !related_artist_list ||
      related_artist_list.length < RELATED_ARTIST_LIST_SIZE
    ) {
      related_artist_list = await getRelatedArtistListFromApi(artist_id)
    }

    const random_related_artist_name_list =
      shuffleRelatedArtistNameList(related_artist_list)

    Logger.debug(
      `ArtistHelper :: getRelatedArtistNameList :: END random_related_artist_name_list: ${JSON.stringify(
        random_related_artist_name_list
      )}`
    )
    return random_related_artist_name_list
  } catch (err) {
    Logger.debug(`ArtistHelper :: getRelatedArtistNameList :: ERR: ${err}`)
    throw err
  }
}

const getRelatedArtistListFromApi = async (
  artist_id: number
): Promise<string[]> => {
  try {
    Logger.debug(
      `ArtistHelper :: getRelatedArtistListFromApi :: START artist_id: ${artist_id}`
    )
    const new_related_artist_list =
      await musixmatchService.getRelatedArtistList(artist_id)

    if (!new_related_artist_list) {
      return []
    }

    await artistService.createArtistList(new_related_artist_list)

    const names_related_artist_list = getArtistNameFromArtist(
      new_related_artist_list
    )

    if (names_related_artist_list.length > 0) {
      // save related into DB
      await artistService.addRelatedArtistListToArtist(
        artist_id,
        names_related_artist_list
      )
    }

    if (names_related_artist_list.length < 2) {
      const random_artist_list = await artistService.getRandomArtistList(
        RELATED_ARTIST_LIST_SIZE - names_related_artist_list.length,
        artist_id
      )

      if (!random_artist_list) {
        return []
      }

      return getArtistNameFromArtist(random_artist_list)
    }
    return names_related_artist_list
  } catch (err) {
    Logger.debug(`ArtistHelper :: createArtistListFromTrackList :: ERR: ${err}`)
    throw err
  }
}

const createArtistListFromTrackList = async (track_list: ITrack[]) => {
  Logger.debug(
    `ArtistHelper :: createArtistListFromTrackList :: START track_list: ${JSON.stringify(
      track_list
    )}`
  )
  const to_save_artist_list = []
  for (const track of track_list) {
    to_save_artist_list.push({
      artist_id: track.artist_id,
      artist_name: track.artist_name,
      related_artist_names: [],
    })
  }
  try {
    await artistService.createArtistList(to_save_artist_list)
  } catch (err) {
    Logger.debug(`ArtistHelper :: createArtistListFromTrackList :: ERR: ${err}`)
    throw err
  }
}

const getArtistNameFromArtist = (artist_list: IArtist[]): string[] => {
  return artist_list.map((artist) => artist.artist_name)
}

const shuffleRelatedArtistNameList = (related_artist_list: string[]) => {
  return related_artist_list
    .sort(() => Math.random() - Math.random())
    .slice(RELATED_ARTIST_LIST_START, RELATED_ARTIST_LIST_SIZE) // 0 -> 2
}

const getLazyArtistNameList = async (track: ITrack): Promise<string[]> => {
  try {
    Logger.debug(
      `ArtistHelper :: getLazyArtistNameList :: START track: ${JSON.stringify(
        track
      )}`
    )

    const random_artist_list = await artistService.getRandomArtistList(
      RELATED_ARTIST_LIST_SIZE,
      track.artist_id
    )

    if (!random_artist_list) {
      return []
    }
    const lazy_artist_list = [...getArtistNameFromArtist(random_artist_list)]
    Logger.debug(
      `ArtistHelper :: getLazyArtistNameList :: END lazy_artist_list: ${JSON.stringify(
        lazy_artist_list
      )}`
    )
    return lazy_artist_list
  } catch (err) {
    Logger.debug(`ArtistHelper :: getLazyArtistNameList :: ERR: ${err}`)
    throw err
  }
}

export const artistHelper = {
  createArtistListFromTrackList,
  getRelatedArtistNameList,
  getLazyArtistNameList,
}
