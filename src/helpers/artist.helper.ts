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
    const new_related_artist_list =
      await musixmatchService.getRelatedArtistList(artist_id)

    if (!new_related_artist_list) {
      // Logger.error(
      //   `ArtistHelper :: getRelatedArtistNameList :: new_related_artist_list`
      // )
      throw new Error(
        'ARTIST_HELPER::GET_RELATED_ARTIST_NAME_LIST::ERROR_NEW_RELATED_LIST'
      )
    }
    const saved_related_artist_list = await artistService.createArtistList(
      new_related_artist_list
    )

    let new_names_related_artist_list = getArtistNameFromArtist(
      new_related_artist_list
    )

    if (new_names_related_artist_list.length > 0) {
      // salvataggio sul DB
      await artistService.addRelatedArtistList(
        artist_id,
        new_names_related_artist_list
      )
    }

    if (new_names_related_artist_list.length < 2) {
      const random_artist_list = await artistService.getRandomArtistList(
        RELATED_ARTIST_LIST_SIZE - new_names_related_artist_list.length,
        artist_id
      )

      if (!random_artist_list) {
        throw new Error(
          'ARTIST_HELPER::GET_RELATED_ARTIST_NAME_LIST::ERROR_RANDOM_ARTIST_LIST'
        )
      }

      new_names_related_artist_list = [
        ...getArtistNameFromArtist(random_artist_list),
      ]
    }
    related_artist_list = [...new_names_related_artist_list]
  }

  const random_related_artist_name_list =
    shuffleRelatedArtistNameList(related_artist_list)

  Logger.debug(
    `ArtistHelper :: getRelatedArtistNameList :: END random_related_artist_name_list: ${JSON.stringify(
      random_related_artist_name_list
    )}`
  )
  return random_related_artist_name_list
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
    console.log(`TRACK_HELPER::CREATE_ARTIST_LIST_FROM_TRACK_LIST::ERR: ${err}`)
    Logger.error(`ArtistHelper :: createArtistListFromTrackList :: ERR: ${err}`)
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
  Logger.debug(`ArtistHelper :: getLazyArtistNameList :: START track: ${JSON.stringify(track)}`)

  const random_artist_list = await artistService.getRandomArtistList(
    RELATED_ARTIST_LIST_SIZE,
    track.artist_id
  )

  if (!random_artist_list) {
    throw new Error(
      'ARTIST_HELPER::GET_LAZY_ARTIST_NAME_LIST::ERROR_NEW_RELATED_LIST'
    )
  }
  const lazy_artist_list = [...getArtistNameFromArtist(random_artist_list)]
  Logger.debug(
    `ArtistHelper :: getLazyArtistNameList :: END lazy_artist_list: ${JSON.stringify(
      lazy_artist_list
    )}`
  )
  return lazy_artist_list
}

export const artistHelper = {
  createArtistListFromTrackList,
  getRelatedArtistNameList,
  getLazyArtistNameList,
}
