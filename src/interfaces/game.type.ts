export interface IStartGameRequest {
  game_size: number
}

export interface IStartGameResponseItem {
  question: string
  correct_answer: string
  wrong_answers: string[]
}
