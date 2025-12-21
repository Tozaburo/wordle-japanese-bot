import { guess } from "./guess";

export function calculateInformation(words: string[], word: string): number {
    const data: { [key: string]: number } = {};

    for (const answer of words) {
        const result = guess(word, answer);

        if (data[result] !== undefined) {
            data[result]++;
        } else {
            data[result] = 1;
        }
    }

    let information = 0;

    for (const key in data) {
        const p = data[key]! / words.length;
        information += p * Math.log2(1 / p);
    }

    return information;
}