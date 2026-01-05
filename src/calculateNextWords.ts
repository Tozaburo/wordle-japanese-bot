import { guess } from "./guess";
import { validWords, answerWords } from "./words";

export type NextWords = { word: string, steps: number, information: number, probability: number }[];

export function calculateNextWords(filteredWords: string[], steps: number, numberOfCandidates: number, showProgress: boolean = false): NextWords {
    let result: NextWords = [];

    const words = [...validWords, ...answerWords].flat();

    let i = 0;
    for (const word of words) {
        const outcomeCounts: Record<string, number> = {};
        const winPattern = "g".repeat(word.length);

        for (const answer of filteredWords) {
            const pattern = guess(word, answer);
            outcomeCounts[pattern] = (outcomeCounts[pattern] ?? 0) + 1;
        }

        const probability = (outcomeCounts[winPattern] ?? 0) / filteredWords.length;
        let expectedRemainingSteps = 0;
        let information = 0;

        for (const [pattern, count] of Object.entries(outcomeCounts)) {
            const p = count / filteredWords.length;
            information += p * Math.log2(1 / p);

            if (pattern !== winPattern) {
                const subsetUncertainty = Math.log2(count);
                expectedRemainingSteps += p * stepsByUncertainty(subsetUncertainty);
            }
        }

        const estimatedSteps = steps + 1 + expectedRemainingSteps;

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
