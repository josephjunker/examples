import fc from "fast-check";

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

type BinaryTree<T> = {
  contents: T,
  left: BinaryTree<T> | null,
  right: BinaryTree<T> | null
}

function tree<T>(
	rootContents: T, 
	left: BinaryTree<T> | null, 
	right: BinaryTree<T> | null): BinaryTree<T> {
	
    return {
        contents: rootContents,
        left,
        right
    }
}

function leaf<T>(contents: T): BinaryTree<T> {
    return {
        contents,
        left: null,
        right: null
    }
}

// begin-snippet: sumTreeCPS1337
function sumTreeCPS1337<K>(tree: BinaryTree<number>, kOuter: (n: number) => K): K {
    type Exceptions = {
        exit: (n: number) => K,
        throw1337: (resume: () => K) => K,
    }

    function sumTreeInner(
        tree: BinaryTree<number> | null,
        { exit, throw1337 }: Exceptions,
        k: (n: number) => K
    ) {
        if (!tree) return k(0);
        if (tree.contents === 42) return exit(1000);

        // If this node contains 25565 then we want to re-bind the point
        // in the call stack that "throw1337" points to. Make a new throw 
        // function which, when called, exits directly to this subtree's
        // continuation with a constant value.
        const exceptions: Exceptions = {
            exit,
            throw1337: tree.contents === 25565 ?
                (resume) => k(1337) :
                throw1337
        }

        const next: () => K =
            () => sumTreeInner(tree.left, exceptions, (leftSum) =>
                sumTreeInner(tree.right, exceptions, (rightSum) =>
                    k(leftSum + tree.contents + rightSum)));

        // Go back to the stack where `throw1337` was defined. If the handler
        // there wants to resume execution, it will call `next`, and we'll
        // keep going with the same logic as though nothing had happened.
        // If the handler there does *not* want to resume execution, then
        // our current call stack (`k`) will be dropped and we'll switch to
        // the call stack set up by throw1337.
        if (tree.contents === 1337) return throw1337(next);

        return next();
    }

    return sumTreeInner(tree, {
        exit: kOuter,
        throw1337: (resume) => resume(),
    }, kOuter);
}
// end-snippet

const tree_1 = leaf(1);
const tree_3 = tree(1, leaf(1), leaf(1));
const tree_1000 = leaf(42);
const tree_1000_2 = tree(1, leaf(42), leaf(1));
const tree_1337 = tree(25565, leaf(1), leaf(1337));
const tree_1339 = tree(1, leaf(1), leaf(1337));
const tree_1000_3 = tree(25565, leaf(42), leaf(1337));
const tree_1337_2 = tree(25565, leaf(1337), leaf(42));
const tree_25567 = tree(25565, leaf(1), leaf(1));

// 25565 + 1337 + 1
const tree_26903 = tree(25565,
    tree(25565, leaf(1), leaf(1337)),
    leaf(1)
);
const tree_2675 = tree(1,
    tree(25565, leaf(1337), leaf(1)),
    leaf(1337)
)
const tree_1000_4 = tree(1,
    leaf(1),
    tree(1337, leaf(1), leaf(42))
)

function runTest(fn: (tree: BinaryTree<number>) => number) {
    assert.equal(fn(tree_1), 1);
    assert.equal(fn(tree_3), 3);
    assert.equal(fn(tree_1000), 1000);
    assert.equal(fn(tree_1000_2), 1000);
    assert.equal(fn(tree_1337), 1337);
    assert.equal(fn(tree_1339), 1339);
    assert.equal(fn(tree_1000_3), 1000);
    assert.equal(fn(tree_1337_2), 1337);
    assert.equal(fn(tree_25567), 25567);
    assert.equal(fn(tree_26903), 26903);
    assert.equal(fn(tree_2675), 2675);
    assert.equal(fn(tree_1000_4), 1000);
}

const test_cps = suite("CPS");
test_cps("examples", () => runTest(tree => sumTreeCPS1337(tree, x => x)));

test_cps("example from prop run", () => {
    const simplified = tree(
        1337,
        tree(0,
            tree(
                25565,
                null,
                tree(1337, leaf(42), null)),
            null),
        null);

    const fromFcOutput = {"contents":1337,"left":{"contents":0,"left":{"contents":25565,"left":null,"right":{"contents":1337,"left":{"contents":42,"left":null,"right":null},"right":null}},"right":null},"right":null};

    assert.equal(simplified, fromFcOutput);
    assert.equal(sumTreeCPS1337(simplified, x => x), 2674);
});

test_cps.run();


// begin-snippet: sumTreeRec1337
function sumTreeRec1337(tree: BinaryTree<number>): number {
    type RecursiveResult = {
        tag: "Exiting42"
    } | {
        tag: "Throwing1337"
    } | {
        tag: "Sum",
        sum: number
    }

    function sumTreeInner(
        tree: BinaryTree<number> | null,
        has25565Ancestor: boolean): RecursiveResult {

        if (!tree) return {
            tag: "Sum",
            sum: 0
        }

        if (tree.contents === 42) return {
            tag: "Exiting42"
        }

        if (has25565Ancestor && tree.contents === 1337) return {
            tag: "Throwing1337"
        }

        const leftResults = sumTreeInner(
            tree.left,
            has25565Ancestor || tree.contents === 25565);

        if (leftResults.tag === "Exiting42") return leftResults;
        if (leftResults.tag === "Throwing1337" && tree.contents === 25565) return {
            tag: "Sum",
            sum: 1337,
        }
        if (leftResults.tag === "Throwing1337") return leftResults;

        const rightResults = sumTreeInner(
            tree.right,
            has25565Ancestor || tree.contents === 25565);

        if (rightResults.tag === "Exiting42") return rightResults;
        if (rightResults.tag === "Throwing1337" && tree.contents === 25565) return {
            tag: "Sum",
            sum: 1337,
        }
        if (rightResults.tag === "Throwing1337") return rightResults;

        return {
            tag: "Sum",
            sum: leftResults.sum + rightResults.sum + tree.contents,
        }
    }

    const result = sumTreeInner(tree, false);

    if (result.tag === "Exiting42") return 1000;
    if (result.tag === "Throwing1337") throw new Error("TILT: this is impossible");
    return result.sum;
}
// end-snippet

const test_rec = suite("Recursive");
test_rec("examples", () => runTest(sumTreeRec1337));
test_rec("example from prop run", () => {
    const simplified = tree(
        1337,
        tree(0,
            tree(
                25565,
                null,
                tree(1337, leaf(42), null)),
            null),
        null);

    const fromFcOutput = {"contents":1337,"left":{"contents":0,"left":{"contents":25565,"left":null,"right":{"contents":1337,"left":{"contents":42,"left":null,"right":null},"right":null}},"right":null},"right":null};

    assert.equal(simplified, fromFcOutput);

    assert.equal(sumTreeRec1337(simplified), 2674);
});
test_rec.run();

const binaryTreeArbUnbiased = fc.letrec((tie) => ({
    binaryTree: fc.record({
        contents: fc.nat(),
        left: fc.option(tie("binaryTree"), { maxDepth: 8, depthIdentifier: "binaryTree"}),
        right: fc.option(tie("binaryTree"), { maxDepth: 8, depthIdentifier: "binaryTree"}),
    })
})).binaryTree as fc.Arbitrary<BinaryTree<number>>;

const binaryTreeArbBiased = fc.letrec((tie) => ({
    binaryTree: fc.record({
        contents: fc.oneof(
            { arbitrary: fc.nat(), weight: 10 },
            { arbitrary: fc.constant(42), weight: 1 },
            { arbitrary: fc.constant(1337), weight: 2 },
            { arbitrary: fc.constant(25565), weight: 3 }
        ),
        left: fc.option(tie("binaryTree"), { maxDepth: 8, depthIdentifier: "binaryTree"}),
        right: fc.option(tie("binaryTree"), { maxDepth: 8, depthIdentifier: "binaryTree"}),
    })
})).binaryTree as fc.Arbitrary<BinaryTree<number>>;

const test_properties = suite("Properties");

test_properties("Equality, unbiased", () => {
    fc.assert(
        fc.property(binaryTreeArbUnbiased, tree => {
            assert.equal(sumTreeCPS1337(tree, x => x), sumTreeRec1337(tree));
        }),
        { numRuns: 500 });
});

test_properties("Equality, biased", () => {
    fc.assert(
        fc.property(binaryTreeArbBiased, tree => {
            assert.equal(sumTreeCPS1337(tree, x => x), sumTreeRec1337(tree));
        }),
        { numRuns: 1000 });
});

test_properties.run();