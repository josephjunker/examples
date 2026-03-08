import { writeFileSync } from "node:fs";
import {
    type Tree,
    empty,
    node,
    type Forest,
    nil,
    cons,
} from "./forest-trees.mts";

function randomNat(): number {
    return Math.floor(Math.random() * 1000);
}

function generateTree(size: number): Tree<number> {
    if (size <= 1) return empty();
    return node(randomNat(), generateForest(size - 1));
}

function generateForest(size: number): Forest<number> {
    if (size <= 1) return nil();
    const treeSizeDecrease = Math.random() < 0.5 ? 0 : -1;
    const forestSizeDecrease = Math.random() < 0.5 ? 0 : -1;
    const treeToForestRatio = Math.random();
    const treeSize = Math.floor(size * treeToForestRatio) + treeSizeDecrease;
    const forestSize =
        Math.floor(size * (1 - treeToForestRatio)) + forestSizeDecrease;

    return cons(generateTree(treeSize), generateForest(forestSize));
}

export function generateData(): Array<Tree<number>> {
    let results: Array<Tree<number>> = [];

    for (let i = 0; i < 10000; i += 10) {
        results.push(generateTree(i));
    }

    return results;
}

console.log("Generating benchmark data");
const testData = generateData();

console.log("Saving benchmark input data");
writeFileSync("one-thousand-trees.json", JSON.stringify(testData), "utf-8");
console.log("Benchmark data is saved");
console.log();
