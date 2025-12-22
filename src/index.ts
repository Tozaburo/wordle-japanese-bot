import { calculateBestWord } from './calculateBestWord';
import { calculateInformation } from './calculateInformation';
import { guess } from './guess';
import { answerWords } from './words';
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
    let candidates = answerWords;
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
    const initialWord = calculateBestWord(answerWords);

    let data: { [key: string]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 };

    for (let i = 0; i < iterations; i++) {
        process.stdout.write(`\r${i + 1}/${iterations} (${(((i + 1) / iterations) * 100).toFixed(2)}%)`);

        const answer = answerWords[Math.floor(Math.random() * answerWords.length)]!;

        let nextWord: string = initialWord;
        let candidates = answerWords;
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

    console.log("\n\nResults:");

    console.log("1   ", drawBlock(20, data[1]! / iterations), `${data[1]}/${iterations}`, `${data[1]! / iterations * 100}%`);
    console.log("2   ", drawBlock(20, data[2]! / iterations), `${data[2]}/${iterations}`, `${data[2]! / iterations * 100}%`);
    console.log("3   ", drawBlock(20, data[3]! / iterations), `${data[3]}/${iterations}`, `${data[3]! / iterations * 100}%`);
    console.log("4   ", drawBlock(20, data[4]! / iterations), `${data[4]}/${iterations}`, `${data[4]! / iterations * 100}%`);
    console.log("5   ", drawBlock(20, data[5]! / iterations), `${data[5]}/${iterations}`, `${data[5]! / iterations * 100}%`);
    console.log("6   ", drawBlock(20, data[6]! / iterations), `${data[6]}/${iterations}`, `${data[6]! / iterations * 100}%`);
    console.log("fail", drawBlock(20, data["fail"]! / iterations), `${data["fail"]}/${iterations}`, `${data["fail"]! / iterations * 100}%`);
}

function drawBlock(width: number, value: number) {
    const chars = [
        { char: '█', value: 1 },
        { char: '▉', value: 7 / 8 },
        { char: '▊', value: 1 / 3 },
        { char: '▋', value: 5 / 8 },
        { char: '▌', value: 1 / 2 },
        { char: '▍', value: 3 / 8 },
        { char: '▎', value: 1 / 4 },
        { char: '▏', value: 1 / 8 },
        { char: ' ', value: 0 },
    ];

    const blocks = width * value;

    let result = "";

    const fullBlocks = Math.floor(blocks);
    for (let i = 0; i < fullBlocks; i++) {
        result += '█';
    }

    const remainder = blocks - fullBlocks;
    let closestBlock = chars[chars.length - 1]!;
    let minDistance = Math.abs(remainder - closestBlock.value);

    for (const block of chars) {
        const distance = Math.abs(remainder - block.value);
        if (distance < minDistance) {
            minDistance = distance;
            closestBlock = block;
        }
    }

    result += closestBlock.char;

    while (result.length < width) {
        result += ' ';
    }

    return result;
}

main();
// test();