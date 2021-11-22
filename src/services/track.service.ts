import Track from '../models/track.model'
import { ITrack } from '../interfaces/track.type'
import {
  ERROR_NOT_VALID_SNIPPET,
  PLAYED_INIT_VALUE,
  VALID_TRACK_LIST_LIMIT,
  SNIPPET_DB_DIRECTION,
} from '../constants/constants'
import Logger from '../shared/logger.lib'

const createTrackList = async (track_list: ITrack[]) => {
  Logger.debug(`TrackService :: createTrackList :: START`)
  try {
    if (track_list.length === 0) {
      return []
    }
    return Track.bulkWrite(
      track_list.map((track) => ({
        updateOne: {
          filter: { track_id: track.track_id },
          update: track,
          upsert: true,
        },
      }))
    )
  } catch (err) {
    Logger.error(`TrackService :: createTrackList :: Err:${err}`)
    throw new Error(`ERROR CREATING TRACK LIST`)
  }
}

// return random "size" valid_track_list ordered by snippet (before snippet)
const getValidTrackList = async (played: number): Promise<ITrack[] | null> => {
  Logger.debug(`TrackService :: getValidTrackList :: START played:${played}`)
  try {
    return Track.aggregate([
      { $match: { snippet: { $ne: ERROR_NOT_VALID_SNIPPET }, played } },
    ]) // CHECK SE INDICIZZARE QUESTO FLAG => OTTIMIZZARE RICERCA SU QUESTA COLONNA (INDEX)
      .sort({
        snippet: SNIPPET_DB_DIRECTION,
      })
      .limit(VALID_TRACK_LIST_LIMIT) // AVOID MEMORY LEAK AND TIMEOUT DB
  } catch (err) {
    Logger.error(`TrackService :: getValidTrackList :: Err:${err}`)
    throw new Error(`ERROR GETTING VALID TRACK LIST`)
  }
}

const updateManyPlayed = async (track_list: ITrack[]) => {
  Logger.debug(`TrackService :: updateManyPlayed :: START`)

  if (track_list.length === 0) {
    return track_list
  }
  try {
    return Track.bulkWrite(
      track_list.map((track) => ({
        updateOne: {
          filter: { track_id: track.track_id },
          update: { $inc: { played: 1 } },
          upsert: true,
        },
      }))
    )
  } catch (err) {
    Logger.error(`TrackService :: updateManyPlayed :: Err:${err}`)
    throw new Error(`TRACK_SERVICE::UPDATE_MANY_PLAYED::ERROR`)
  }
}

const updateOnePlayed = async (track: ITrack): Promise<ITrack | null> => {
  Logger.debug(`TrackService :: updateOnePlayed :: START`)

  try {
    return Track.findByIdAndUpdate(
      track._id,
      { $inc: { played: 1 } },
      { new: true }
    )
  } catch (err) {
    Logger.error(`TrackService :: updateOnePlayed :: Err:${err}`)
    throw new Error(`TRACK_SERVICE::UPDATE_MANY_PLAYED::ERROR`)
  }
}

const addSnippetIntoTrack = async (
  track: ITrack,
  snippet: string
): Promise<ITrack | null> => {
  Logger.debug(`TrackService :: addSnippetIntoTrack :: START`)

  try {
    if (!snippet) {
      return null
    }
    return Track.findByIdAndUpdate(track._id, { snippet }, { new: true })
  } catch (err) {
    Logger.error(`TrackService :: addSnippetIntoTrack :: Err:${err}`)
    throw new Error(
      `ERROR ADDING SNIPPET: ${snippet} TO TRACK_ID:${track.track_id}`
    )
  }
}

const getUsedPages = async (): Promise<string[] | null> => {
  Logger.debug(`TrackService :: getUsedPages :: START`)

  try {
    return Track.find().distinct('page')
  } catch (err) {
    Logger.error(`TrackService :: getUsedPages :: Err:${err}`)
    throw new Error(`ERROR GETTING PAGES`)
  }
}

const getMinPlayed = async (): Promise<number | null> => {
  Logger.debug(`TrackService :: getMinPlayed :: START`)
  try {
    let track_list = []
    let played = PLAYED_INIT_VALUE
    track_list = await Track.find({ track_id: { $exists: true } })
      .sort({ played: 1 })
      .limit(1)

    if (track_list.length > 0) {
      played = track_list[0].played
    }
    return played
  } catch (err) {
    Logger.error(`TrackService :: getMinPlayed :: Err:${err}`)
    throw new Error(`ERROR GETTING MINIMUM PLAYED COUNTER`)
  }
}

export const trackService = {
  createTrackList,
  getUsedPages,
  getValidTrackList,
  getMinPlayed,
  updateManyPlayed,
  addSnippetIntoTrack,
  updateOnePlayed,
}
