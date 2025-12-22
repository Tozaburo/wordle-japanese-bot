import { calculateInformation } from "./calculateInformation";
import { validWords } from "./words";

export type NextWords = { word: string, steps: number, information: number, probability: number }[];

export function calculateNextWords(filteredWords: string[], steps: number, numberOfCandidates: number, showProgress: boolean = false): NextWords {
    let result: NextWords = [];

    const uncertainty = Math.log2(filteredWords.length);

    const words = [...validWords, ...filteredWords].flat();

    let i = 0;
    for (const word of words) {
        const probability = filteredWords.includes(word) ? (1 / filteredWords.length) : 0;


        const information = calculateInformation(filteredWords, word);

        const estimatedSteps = probability * (steps + 1) + (1 - probability) * (steps + stepsByUncertainty(uncertainty - information));

        i++;
        if (showProgress) {
            process.stdout.write(`\r${i}/${words.length} (${((i / words.length) * 100).toFixed(2)}%)`);
        }

        if (estimatedSteps <= Math.max(...result.map(r => r.steps) ?? Infinity) || result.length < numberOfCandidates) {
            result.push({ word, steps: estimatedSteps, information, probability });
            result.sort((a, b) => (a.steps - b.steps) || (b.probability - a.probability));

            if (result.length > numberOfCandidates) {
                result.pop();
            }
        }
    }

    result.sort((a, b) => (a.steps - b.steps) || (b.probability - a.probability));

    return result;
}

function stepsByUncertainty(uncertainty: number): number {
    return 0.503749 * uncertainty ** 0.632532 + 1;
}