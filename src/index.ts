import { calculateBestWord } from './calculateBestWord';
import { calculateInformation } from './calculateInformation';
import { guess } from './guess';
import { words } from './words';
import { calculateNextWords, type NextWords } from './calculateNextWords';

import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import { filterWords } from './filterWords';

const rl = readline.createInterface({ input, output });

function getUserInput(prompt: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    let nextWord: string;
    let nextWords: NextWords;
    let candidates = words;
    let steps = 0;
    let feedback: string = "";

    while (feedback !== "ggggg") {
        console.log("\n---\n");

        nextWords = calculateNextWords(candidates, steps, 3, true);

        console.log("Next:");

        for (const nextWord of nextWords) {
            console.log(`"${nextWord.word}"   Est. Steps: ${nextWord.steps.toFixed(2)}   Information: ${nextWord.information.toFixed(2)}   Probability: ${nextWord.probability.toFixed(4)}`);
        }

        nextWord = await getUserInput("Enter the next word to guess (Enter nothing to select the best one): ") || nextWords[0]!.word;

        feedback = await getUserInput("Enter the feedback (g=green, y=yellow, w=white): ");

        // Validate feedback
        if (!new RegExp(`^[gyw]{${nextWord.length}}$`).test(feedback)) {
            console.log(`Invalid feedback format. Please enter a string of ${nextWord.length} characters using only 'g', 'y', or 'w'.`);
            continue;
        }

        steps++;

        candidates = filterWords(candidates, nextWord, feedback);
    }
}

function test() {
    const iterations = 100;
    const initialWord = calculateBestWord(words);

    let data: { [key: string]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 };

    for (let i = 0; i < iterations; i++) {
        process.stdout.write(`\r${i}/${iterations} (${((i / iterations) * 100).toFixed(2)}%)`);

        const answer = words[Math.floor(Math.random() * words.length)]!;

        let nextWord: string = initialWord;
        let candidates = words;
        let steps = 0;
        let feedback: string = "";

        do {

            feedback = guess(nextWord, answer);

            steps++;

            candidates = filterWords(candidates, nextWord, feedback);

            nextWord = calculateNextWords(candidates, steps, 1, false)[0]!.word;
        } while (!/^g+$/.test(feedback));

        if (steps <= 6) {
            data[steps]!++;
        } else {
            data["fail"]!++;
        }
    }

    console.log("1: ", data[1]);
    console.log("2: ", data[2]);
    console.log("3: ", data[3]);
    console.log("4: ", data[4]);
    console.log("5: ", data[5]);
    console.log("6: ", data[6]);
    console.log("fail: ", data["fail"]);
}


main();
// test();