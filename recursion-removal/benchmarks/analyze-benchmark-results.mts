import { readFileSync } from "node:fs";

const benchmarkData = JSON.parse(readFileSync("results.json", "utf8"));

const iterativeSumResults: Array<number> = benchmarkData.iterativeSumResults;
const recursiveSumResults: Array<number> = benchmarkData.recursiveSumResults;
const iterativeCollectResults: Array<number> =
    benchmarkData.iterativeCollectResults;
const recursiveCollectResults: Array<number> =
    benchmarkData.recursiveCollectResults;

function oneDecimal(n: number) {
    const rounded = String(Math.round(n * 10) / 10);
    return rounded.includes(".") ? rounded : `${rounded}.0`;
}

function stats(data: Array<number>) {
    data.sort((a, b) => a - b);

    const min = data[0]!;
    const max = data[data.length - 1]!;
    const sum = data.reduce((x, y) => x + y, 0);
    const mean = sum / data.length;
    const median = data[Math.floor(data.length / 2)]!;
    const sumOfSquares = data
        .map((point) => Math.pow(point - mean, 2))
        .reduce((x, y) => x + y, 0);
    const variance = sumOfSquares / data.length;
    const standardDeviation = Math.sqrt(variance);

    console.log(`minimum:         ${oneDecimal(min)}`);
    console.log(`maximum:         ${oneDecimal(max)}`);
    console.log(`mean:            ${oneDecimal(mean)}`);
    console.log(`median:          ${oneDecimal(median)}`);
    console.log(
        `std. deviation:  ${Math.round(standardDeviation * 100) / 100}`,
    );

    return median;
}

function threeDigits(n: number): string {
    return String(n).slice(0, 4);
}

console.log("Iterative sum results:");
console.log("----------------------");
const iterativeMedian = stats(iterativeSumResults);
console.log();
console.log("Recursive sum results:");
console.log("----------------------");
const recursiveMedian = stats(recursiveSumResults);
console.log();
console.log(
    `Iteration is ${threeDigits(iterativeMedian / recursiveMedian)}x slower than recursion`,
);

console.log();
console.log();
console.log("Iterative collection results:");
console.log("-----------------------------");
const iterativeCollectionMedian = stats(iterativeCollectResults);
console.log();
console.log("Recursive collection results:");
console.log("-----------------------------");
const recursiveCollectionMedian = stats(recursiveCollectResults);
console.log();
console.log(
    `Iteration is ${threeDigits(iterativeCollectionMedian / recursiveCollectionMedian)}x slower than recursion`,
);
