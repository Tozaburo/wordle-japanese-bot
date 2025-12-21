export function filterWords(words: string[], guess: string, feedback: string): string[] {
    const filteredWords: string[] = [];

    for (const word of words) {
        if (isWordValid(word, guess, feedback)) {
            filteredWords.push(word);
        }
    }

    return filteredWords;
}

function isWordValid(word: string, guess: string, feedback: string): boolean {
    // Count required letters from green and yellow positions
    const requiredCount: { [key: string]: number } = {};
    const greenPositions: { [key: number]: string } = {};
    const yellowLetters: string[] = [];
    const grayLetters: string[] = [];

    for (let i = 0; i < 5; i++) {
        const gChar = guess[i]!;
        const fChar = feedback[i]!;

        if (fChar === "g") {
            greenPositions[i] = gChar;
            requiredCount[gChar] = (requiredCount[gChar] || 0) + 1;
        } else if (fChar === "y") {
            yellowLetters.push(gChar);
            requiredCount[gChar] = (requiredCount[gChar] || 0) + 1;
        } else if (fChar === "w") {
            grayLetters.push(gChar);
        }
    }

    // Check green positions
    for (const [pos, char] of Object.entries(greenPositions)) {
        if (word[parseInt(pos)] !== char) {
            return false;
        }
    }

    // Check yellow constraints
    for (let i = 0; i < 5; i++) {
        const gChar = guess[i]!;
        const fChar = feedback[i]!;

        if (fChar === "y") {
            // Letter must exist in word but not at this position
            if (!word.includes(gChar) || word[i] === gChar) {
                return false;
            }
        }
    }

    // Check letter count constraints
    for (const [letter, minCount] of Object.entries(requiredCount)) {
        const actualCount = word.split(letter).length - 1;
        if (actualCount < minCount) {
            return false;
        }
    }

    // Check gray letter constraints
    const maxAllowedCount: { [key: string]: number } = {};
    for (const letter of grayLetters) {
        maxAllowedCount[letter] = requiredCount[letter] || 0;
    }

    for (const [letter, maxCount] of Object.entries(maxAllowedCount)) {
        const actualCount = word.split(letter).length - 1;
        if (actualCount > maxCount) {
            return false;
        }
    }

    return true;
}