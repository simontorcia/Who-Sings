export const ORIGIN = 'https://api.musixmatch.com/ws/1.1'

export const GET_TRACKS_CONFIG = {
  uri: '/track.search',
  page_size_conf: 100,
  f_has_lyrics: 1,
}

export const GET_SNIPPET = {
  uri: '/track.snippet.get',
}

export const GET_RELATED_ARTISTS = {
  uri: '/artist.related.get',
  page: 1,
  format: 'json',
  page_size: 10, // max
}
