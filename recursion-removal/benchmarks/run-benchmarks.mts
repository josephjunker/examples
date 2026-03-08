import { readFileSync } from "node:fs";
import { type Tree } from "./forest-trees.mts";
import { foldTreeRecursive, foldTreeIterative } from "./folds-final.mts";
import { writeFileSync } from "node:fs";

console.log("Loading input data");

const trees: Array<Tree<number>> = JSON.parse(
    readFileSync("one-thousand-trees.json", "utf-8"),
);

async function waitOneSecond() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
}

async function runGC() {
    if (!global || !global.gc) throw new Error("Run with --expose-gc");
    global.gc();
    // GC collection is not guaranteed after calling global.gc(), but
    // 1 second seems like vastly more time than it would need.
    await waitOneSecond();
}

async function singleBenchmark<T>(count: number, fn: () => T): Promise<number> {
    await runGC();
    const results = new Array(count);
    const start = performance.now();

    for (let i = 0; i < count; i++) {
        results[i] = fn();
    }

    const stop = performance.now();

    // I want to make sure these results get collected and the loop as a whole
    // doesn't get optimized away, and this is one way to do it
    writeFileSync("/dev/null", JSON.stringify(results));

    return stop - start;
}

function sumIterative(): Array<number> {
    let result = new Array(trees.length);
    for (let i = 0; i < trees.length; i++) {
        result[i] = foldTreeIterative(0, trees[i]!, (acc, x) => acc + x);
    }
    return result;
}

function sumRecursive(): Array<number> {
    let result = new Array(trees.length);
    for (let i = 0; i < trees.length; i++) {
        result[i] = foldTreeRecursive(0, trees[i]!, (acc, x) => acc + x);
    }
    return result;
}

function collectIterative(): Array<Array<number>> {
    let result: Array<Array<number>> = new Array(trees.length);
    for (let i = 0; i < trees.length; i++) {
        result[i] = foldTreeIterative(
            [] as Array<number>,
            trees[i]!,
            (acc, x) => {
                acc.push(x);
                return acc;
            },
        );
    }
    return result;
}

function collectRecursive(): Array<Array<number>> {
    let result: Array<Array<number>> = new Array(trees.length);
    for (let i = 0; i < trees.length; i++) {
        result[i] = foldTreeRecursive(
            [] as Array<number>,
            trees[i]!,
            (acc, x) => {
                acc.push(x);
                return acc;
            },
        );
    }
    return result;
}

const REPS_PER_BENCHMARK = 10;
const NUM_BENCHMARKS = 30;

const iterativeSumResults: Array<number> = [];
const recursiveSumResults: Array<number> = [];

console.log();
console.log("Running sum benchmarks");

for (let i = 0; i < NUM_BENCHMARKS; i++) {
    const warmup1 = await singleBenchmark(REPS_PER_BENCHMARK, sumIterative);
    const warmup2 = await singleBenchmark(REPS_PER_BENCHMARK, sumIterative);
    iterativeSumResults.push(
        await singleBenchmark(REPS_PER_BENCHMARK, sumIterative),
    );

    const warmup3 = await singleBenchmark(REPS_PER_BENCHMARK, sumRecursive);
    const warmup4 = await singleBenchmark(REPS_PER_BENCHMARK, sumRecursive);
    recursiveSumResults.push(
        await singleBenchmark(REPS_PER_BENCHMARK, sumRecursive),
    );

    console.log(`Done with sum benchmark ${i + 1}/${NUM_BENCHMARKS}`);
}

console.log();
console.log("Running collection benchmarks");

const iterativeCollectResults: Array<number> = [];
const recursiveCollectResults: Array<number> = [];

for (let i = 0; i < NUM_BENCHMARKS; i++) {
    const warmup1 = await singleBenchmark(REPS_PER_BENCHMARK, collectIterative);
    const warmup2 = await singleBenchmark(REPS_PER_BENCHMARK, collectIterative);
    iterativeCollectResults.push(
        await singleBenchmark(REPS_PER_BENCHMARK, collectIterative),
    );

    const warmup3 = await singleBenchmark(REPS_PER_BENCHMARK, collectRecursive);
    const warmup4 = await singleBenchmark(REPS_PER_BENCHMARK, collectRecursive);
    recursiveCollectResults.push(
        await singleBenchmark(REPS_PER_BENCHMARK, collectRecursive),
    );

    console.log(`Done with collection benchmark ${i + 1}/${NUM_BENCHMARKS}`);
}

writeFileSync(
    "results.json",
    JSON.stringify(
        {
            iterativeSumResults,
            recursiveSumResults,
            iterativeCollectResults,
            recursiveCollectResults,
        },
        null,
        4,
    ),
    "utf-8",
);

console.log();
console.log("Benchmarking complete");
console.log();
