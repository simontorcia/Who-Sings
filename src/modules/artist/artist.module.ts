import { artistHelper } from './artist.helper'
import Artist from './artist.model'
import { artistService } from './artist.service'

export const artistModule = {
  helper: artistHelper,
  service: artistService,
  model: Artist,
}
