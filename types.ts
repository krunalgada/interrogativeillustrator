
export enum GameState {
  SEARCH,
  GENERATING,
  QUIZ,
  REVEAL,
  MEME,
}

export type Question = string;

export interface WordCloudWord {
  text: string;
  value: number;
}
