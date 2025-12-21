import { calculateInformation } from "./calculateInformation";

export function calculateBestWord(words: string[], showProgress: boolean = false): string {
    let bestWord = "";
    let bestInformation = -1;

    let i = 0;
    for (const candidate of words) {
        const information = calculateInformation(words, candidate);

        i++;
        if (showProgress) {
            process.stdout.write(`\rProgress: ${i}/${words.length} (${((i / words.length) * 100).toFixed(2)}%) - Current Best: ${bestWord} (${bestInformation.toFixed(4)})`);
        }

        if (information > bestInformation) {
            bestInformation = information;
            bestWord = candidate;
        }
    }

    return bestWord;
}