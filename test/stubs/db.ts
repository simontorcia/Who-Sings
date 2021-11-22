export const trackServiceStub = {
  empty_valid_track_list: [],
  snippet_empty_valid_track_list: [
    {
      page: '49',
      track_id: 1,
      track_name: 'track_name_01',
      artist_id: 10,
      artist_name: 'artist_name_01',
      played: 0,
      snippet: '',
    },
    {
      page: '49',
      track_id: 2,
      track_name: 'track_name_02',
      artist_id: 20,
      artist_name: 'artist_name_02',
      played: 0,
      snippet: '',
    },
    {
      page: '49',
      track_id: 3,
      track_name: 'track_name_03',
      artist_id: 30,
      artist_name: 'artist_name_03',
      played: 0,
      snippet: '',
    },
    {
      page: '49',
      track_id: 21,
      track_name: 'track_name_01',
      artist_id: 10,
      artist_name: 'artist_name_01',
      played: 0,
      snippet: '',
    },
    {
      page: '49',
      track_id: 12,
      track_name: 'track_name_02',
      artist_id: 20,
      artist_name: 'artist_name_02',
      played: 0,
      snippet: '',
    },
    {
      page: '49',
      track_id: 33,
      track_name: 'track_name_03',
      artist_id: 30,
      artist_name: 'artist_name_03',
      played: 0,
      snippet: '',
    },
    {
      page: '49',
      track_id: 4,
      track_name: 'track_name_04',
      artist_id: 40,
      artist_name: 'artist_name_04',
      played: 0,
      snippet: '',
    },
    {
      page: '49',
      track_id: 5,
      track_name: 'track_name_05',
      artist_id: 50,
      artist_name: 'artist_name_05',
      played: 0,
      snippet: '',
    },
  ],
  snippet_valid_track_list: [
    {
      page: '49',
      track_id: 51,
      track_name: 'track_name_01',
      artist_id: 10,
      artist_name: 'artist_name_01',
      played: 0,
      snippet: 'snippet_01',
    },
    {
      page: '49',
      track_id: 52,
      track_name: 'track_name_02',
      artist_id: 20,
      artist_name: 'artist_name_02',
      played: 0,
      snippet: 'snippet',
    },
    {
      page: '49',
      track_id: 151,
      track_name: 'track_name_01',
      artist_id: 10,
      artist_name: 'artist_name_01',
      played: 0,
      snippet: 'snippet_01',
    },
    {
      page: '49',
      track_id: 152,
      track_name: 'track_name_02',
      artist_id: 20,
      artist_name: 'artist_name_02',
      played: 0,
      snippet: 'snippet',
    },
    {
      page: '49',
      track_id: 53,
      track_name: 'track_name_03',
      artist_id: 30,
      artist_name: 'artist_name_03',
      played: 0,
      snippet: 'snippet',
    },
    {
      page: '49',
      track_id: 54,
      track_name: 'track_name_04',
      artist_id: 40,
      artist_name: 'artist_name_04',
      played: 0,
      snippet: 'snippet',
    },
    {
      page: '49',
      track_id: 55,
      track_name: 'track_name_05',
      artist_id: 50,
      artist_name: 'artist_name_05',
      played: 0,
      snippet: 'snippet',
    },
  ],
  getUsedPages: ['10', '64'],
  snippet_track_list: [
    {
      page: '49',
      track_id: 11,
      track_name: 'track_name_01',
      artist_id: 10,
      artist_name: 'artist_name_01',
      played: 0,
      snippet: 'ciao ciao ciao ',
    },
    {
      page: '49',
      track_id: 12,
      track_name: 'track_name_02',
      artist_id: 20,
      artist_name: 'artist_name_02',
      played: 0,
      snippet: 'ciao ciao ciao ',
    },
  ],
  addSnippetIntoTrack: [
    {
      page: '49',
      track_id: 31,
      track_name: 'track_name_01',
      artist_id: 10,
      artist_name: 'artist_name_01',
      played: 0,
      snippet: 'ciao ciao ciao ',
    },
    {
      page: '49',
      track_id: 32,
      track_name: 'track_name_02',
      artist_id: 20,
      artist_name: 'artist_name_02',
      played: 0,
      snippet: 'ciao ciao ciao ',
    },
  ],
  updateOnePlayed: [
    {
      page: '49',
      track_id: 91,
      track_name: 'track_name_01',
      artist_id: 10,
      artist_name: 'artist_name_01',
      played: 1,
      snippet: 'ciao ciao ciao ',
    },
    {
      page: '49',
      track_id: 92,
      track_name: 'track_name_02',
      artist_id: 20,
      artist_name: 'artist_name_02',
      played: 1,
      snippet: 'ciao ciao ciao ',
    },
  ],
}

export const artistServiceStub = {
  empty_related_artist_name_list: [],
  related_artist_name_list: [
    'Karaoke 365',
    'Cover Pop',
    'Simone',
    'Ligabue',
    'Salmo',
    'Marracash',
  ],

  addRelatedArtistListToArtist: {
    artist_id: 25765679,
    artist_name: '2010s Karaoke Band',
    related_artist_names: [
      'Karaoke 365',
      'Cover Pop',
      'Simone',
      'Ligabue',
      'Salmo',
      'Marracash',
    ],
  },
}

export const playerService = {}
