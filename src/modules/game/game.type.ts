export interface IStartGameRequest {
  game_size: number
  url: string
}

export interface IStartGameResponseItem {
  question: string
  correct_answer: string
  wrong_answers: string[]
}
