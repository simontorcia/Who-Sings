import Logger from '../../shared/logger.lib'
import { IArtist } from './artist.type'
import { artistModule } from './artist.module'
import { MONGO_DB_STRING_TYPE } from '../../constants/constants'

const createArtistList = async (artist_list: IArtist[]) => {
  Logger.debug(`ArtistSevice :: createArtistList :: START`)
  if (artist_list.length === 0) {
    Logger.debug(`ArtistSevice :: createArtistList :: artist_list empty`)
    return artist_list
  }
  try {
    return artistModule.model.bulkWrite(
      artist_list.map((artist) => ({
        updateOne: {
          filter: { artist_id: artist.artist_id },
          update: artist,
          upsert: true,
        },
      }))
    )
  } catch (err) {
    Logger.error(`ArtistSevice :: createArtistList :: Err:${err}`)
    throw new Error(
      `ARTIST_SERVICE::CREATE_ARTIST_LIST::ERROR CREATING ARTIST LIST`
    )
  }
}

const getArtist = async (artist_id: number): Promise<IArtist | null> => {
  Logger.debug(`ArtistSevice :: getArtist :: START`)
  try {
    return artistModule.model.findOne({ artist_id })
  } catch (err) {
    Logger.error(`ArtistSevice :: getArtist :: Err:${err}`)
    throw new Error(
      `ARTIST_SERVICE::GET_ARTIST::ERROR_GETTING_ARTIST ${artist_id}`
    )
  }
}

const addRelatedArtistListToArtist = async (
  artist_id: number,
  related_artist_names: string[]
): Promise<IArtist | null> => {
  Logger.debug(`ArtistSevice :: addRelatedArtistListToArtist :: START`)
  try {
    return artistModule.model.findOneAndUpdate(
      { artist_id },
      { related_artist_names }
    )
  } catch (err) {
    Logger.error(`ArtistSevice :: addRelatedArtistListToArtist :: Err:${err}`)
    throw new Error(`ARTIST_SERVICE::ADD_RELATED_ARTIST_LIST::ERROR`)
  }
}

const getRandomArtistList = async (
  size: number,
  artist_id: number
): Promise<IArtist[] | null> => {
  Logger.debug(`ArtistSevice :: getRandomArtistList :: START`)
  try {
    return artistModule.model.aggregate([
      // { $match: { artist_id: { $ne: artist_id }, $and :[{"artist_id":{"$ne":""}},{"artist_id":{"$ne":null}}] } },
      {
        $match: {
          artist_id: { $ne: artist_id },
          artist_name: { $exists: true, $type: MONGO_DB_STRING_TYPE }, // type 2 string
        },
      },
      { $sample: { size } },
    ])
  } catch (err) {
    Logger.error(`ArtistSevice :: getRandomArtistList :: Err:${err}`)
    throw new Error(`ARTIST_SERVICE::GET_RANDOM_ARTIST_LIST::ERROR`)
  }
}

const getRelatedArtistNameList = async (
  artist_id: number
): Promise<string[] | null> => {
  Logger.debug(`ArtistSevice :: getRelatedArtistNameList :: START`)
  let name_list: string[] = []
  try {
    const artist = await artistModule.model
      .findOne({
        artist_id,
      })
      .select('related_artist_names')

    if (artist) {
      name_list = [...name_list, ...artist.related_artist_names]
    }
    return name_list
  } catch (err) {
    Logger.error(`ArtistSevice :: getRelatedArtistNameList :: Err:${err}`)
    throw new Error(`ARTIST_SERVICE::GET_RELATED_ARTIST_NAME_LIST::ERROR`)
  }
}

export const artistService = {
  createArtistList,
  getArtist,
  getRandomArtistList,
  getRelatedArtistNameList,
  addRelatedArtistListToArtist,
}
