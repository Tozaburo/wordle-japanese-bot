export function guess(word: string, answer: string) {
    let result = "";

    const wordArray = Array.from(word);
    const answerArray: (string | null)[] = Array.from(answer);

    // First pass: mark all exact matches (green)
    for (let i = 0; i < word.length; i++) {
        if (wordArray[i] === answerArray[i]) {
            result += "g";
            answerArray[i] = null; // Remove from available pool
        } else {
            result += "?";
        }
    }

    // Second pass: mark yellows and whites
    const resultArray = Array.from(result);
    for (let i = 0; i < word.length; i++) {
        if (resultArray[i] === "?") {
            const index = answerArray.indexOf(wordArray[i]!);
            if (index !== -1) {
                resultArray[i] = "y";
                answerArray[index] = null; // Remove from available pool
            } else {
                resultArray[i] = "w";
            }
        }
    }

    return resultArray.join("");
}