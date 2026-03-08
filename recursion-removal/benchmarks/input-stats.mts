import { readFileSync } from "node:fs";
import { type Tree } from "./forest-trees.mts";
import { foldTreeRecursive } from "./folds-final.mts";

const trees: Array<Tree<number>> = JSON.parse(
    readFileSync("one-thousand-trees.json", "utf-8"),
);

console.log();
console.log("Collecting summary statistics on input tree sizes");
console.log();

const nodeCounts = trees.map((tree) =>
    foldTreeRecursive(0, tree, (acc, _) => acc + 1),
);

nodeCounts.sort((a, b) => a - b);
const sum = nodeCounts.reduce((acc, x) => acc + x, 0);
const max = nodeCounts[999]!;

console.log("Summary stats on node counts");
console.log("----------------------------");
console.log(`Mean:    ${sum / 1000}`);
console.log(`Median:  ${nodeCounts[499]}`);
console.log(`Minimum: ${nodeCounts[0]}`);
console.log(`Maximum: ${max}`);
console.log();

const buckets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const bucketSize = Math.ceil(max / 10) + 1;

for (const nodeCount of nodeCounts) {
    buckets[Math.floor(nodeCount / bucketSize)]! += 1;
}

console.log("Node counts, bucketed by size:");
for (let i = 0; i < 10; i++) {
    const start = String(i * bucketSize);
    const end = String((i + 1) * bucketSize);
    const prefix = `${start}-${end}:`.padEnd(10, " ");

    console.log(`${prefix} ${buckets[i]}`);
}
console.log();
