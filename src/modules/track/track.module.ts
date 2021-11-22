import { trackHelper } from './track.helper'
import Track from './track.model'
import { trackService } from './track.service'

export const trackModule = {
  helper: trackHelper,
  service: trackService,
  model: Track,
}
