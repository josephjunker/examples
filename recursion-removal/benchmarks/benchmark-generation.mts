import { writeFileSync } from "node:fs";

type Tree<T> =
    | {
          tag: "Empty";
      }
    | {
          tag: "Node";
          value: T;
          forest: Forest<T>;
      };

type Forest<T> =
    | {
          tag: "Nil";
      }
    | {
          tag: "Cons";
          head: Tree<T>;
          tail: Forest<T>;
      };

function empty<T>(): Tree<T> {
    return {
        tag: "Empty",
    };
}

function node<T>(value: T, forest: Forest<T>): Tree<T> {
    return {
        tag: "Node",
        value,
        forest,
    };
}

function nil<T>(): Forest<T> {
    return {
        tag: "Nil",
    };
}

function cons<T>(head: Tree<T>, tail: Forest<T>): Forest<T> {
    return {
        tag: "Cons",
        head,
        tail,
    };
}

function generateTree(size: number): Tree<number> {
    if (size <= 1) return empty();
    return node(Math.ceil(size * 2 * Math.random()), generateForest(size - 1));
}

function generateForest(size: number): Forest<number> {
    if (size <= 1) return nil();
    const ratio = Math.random();
    const treeSizeDecrease = Math.random() < 0.5 ? 0 : -1;
    const forestSizeDecrease = Math.random() < 0.5 ? 0 : -1;
    const treeSize = Math.floor(size * ratio) + treeSizeDecrease;
    const forestSize = Math.floor(size * (1 - ratio)) + forestSizeDecrease;

    return cons(generateTree(treeSize), generateForest(forestSize));
}

export function generateData(): Array<Tree<number>> {
    let results: Array<Tree<number>> = [];

    for (let i = 995; i < 1000; i++) {
        results.push(generateTree(i));
    }

    return results;
}

function foldTreeDepthFirst<S, T>(
    accumulator: S,
    tree: Tree<T>,
    fn: (accumulator: S, value: T) => S,
): S {
    if (tree.tag === "Empty") return accumulator;
    return foldForestDepthFirst(fn(accumulator, tree.value), tree.forest, fn);
}

function foldForestDepthFirst<S, T>(
    accumulator: S,
    forest: Forest<T>,
    fn: (accumulator: S, value: T) => S,
): S {
    if (forest.tag === "Nil") return accumulator;
    const newAcc = foldTreeDepthFirst(accumulator, forest.head, fn);
    return foldForestDepthFirst(newAcc, forest.tail, fn);
}

const testData = generateData();

// when run from 0 - 1000, this shows a relatively even distribution of node counts
// from 0 to around 5000 or so
/*
for (const data of testData) {
    console.log(foldTreeDepthFirst(0, data, (acc, x) => acc + x));
}
*/

writeFileSync("benchmark-input.json", JSON.stringify(testData), "utf-8");
