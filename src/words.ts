import * as fs from 'fs';

// For original Wordle
export const validWords = fs.readFileSync("./data/wordle-valid-words.txt", 'utf8').split("\n");
export const answerWords = fs.readFileSync("./data/wordle-answer-words.txt", 'utf8').split("\n");

// For Wordle Japanese
// export const validWords = [];
// export const answerWords = fs.readFileSync("./data/wordle-japanese-words.txt", 'utf8').split("\n");