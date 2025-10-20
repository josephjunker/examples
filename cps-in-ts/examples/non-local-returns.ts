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

const orderedTree = tree(
    1,
    tree(2, leaf(3), leaf(4)),
    tree(5, leaf(6), leaf(7))
)

// begin-snippet: sumTreeRec42
function sumTreeRec42(tree: BinaryTree<number>): number {
    function sumTreeInner(tree: BinaryTree<number> | null): [number, boolean] {
        if (!tree) return [0, false];

        if (tree.contents === 42) return [1000, true];

        const [leftSum, leftReturnedEarly] = sumTreeInner(tree.left);
        if (leftReturnedEarly) return [1000, true];

        const [rightSum, rightReturnedEarly] = sumTreeInner(tree.right);
        if (rightReturnedEarly) return [1000, true];

        return [leftSum + rightSum + tree.contents, false];
    }

    return sumTreeInner(tree)[0];
}
// end-snippet

const test_sumTreeRec42 = suite("sumTreeRec42")

test_sumTreeRec42("1", () => assert.equal(sumTreeRec42(leaf(1)), 1))
test_sumTreeRec42("nested, non-42", () => assert.equal(sumTreeRec42(orderedTree), 28))
test_sumTreeRec42("root 42", () => assert.equal(sumTreeRec42(leaf(42)), 1000))

test_sumTreeRec42("nested 42", () => assert.equal(
    sumTreeRec42(tree(1,leaf(42), leaf(1))),
    1000))

test_sumTreeRec42("double nested 42", () => assert.equal(
    sumTreeRec42(
        tree(1,
            tree(1,
                leaf(1),
                leaf(42)
            ),
            leaf(1))),
    1000))

test_sumTreeRec42.run();

// begin-snippet: sumTreeIter42
function sumTreeIter42(tree: BinaryTree<number>): number {
    const stack: Array<BinaryTree<number>> = [tree];
    let total = 0;

    while (stack.length) {
        const node = stack.pop()!;

        // This new line is the only change
        if (node.contents === 42) return 1000;

        total += node.contents;

        if (node.left) {
            stack.push(node.left);
        }

        if (node.right) {
            stack.push(node.right);
        }
    }

    return total;
}
// end-snippet

const test_sumTreeIter42 = suite("sumTreeIter42")

test_sumTreeIter42("1", () => assert.equal(sumTreeIter42(leaf(1)), 1))
test_sumTreeIter42("nested, non-42", () => assert.equal(sumTreeIter42(orderedTree), 28))
test_sumTreeIter42("root 42", () => assert.equal(sumTreeIter42(leaf(42)), 1000))

test_sumTreeIter42("nested 42", () => assert.equal(
    sumTreeIter42(tree(1,leaf(42), leaf(1))),
    1000))

test_sumTreeIter42("double nested 42", () => assert.equal(
    sumTreeIter42(
        tree(1,
            tree(1,
                leaf(1),
                leaf(42)
            ),
            leaf(1))),
    1000))

test_sumTreeIter42.run();

// begin-snippet: sumTreeCPS42
function sumTreeCPS42<K>(tree: BinaryTree<number>, kOuter: (n: number) => K): K {
    function sumTreeInner<K>(
        tree: BinaryTree<number> | null,
        exit: (n: number) => K,
        k: (n: number) => K
    ) {
        if (!tree) return k(0);
        if (tree.contents === 42) return exit(1000);

    return sumTreeInner(tree.left, exit, (leftSum) =>
        sumTreeInner(tree.right, exit, (rightSum) =>
            k(leftSum + tree.contents + rightSum)));
    }

    return sumTreeInner(tree, kOuter, kOuter);
}
// end-snippet

const test_sumTreeCPS42 = suite("sumTreeCPS42")

test_sumTreeCPS42("1", () => assert.equal(sumTreeCPS42(leaf(1), x => x), 1))
test_sumTreeCPS42("nested, non-42", () => assert.equal(sumTreeCPS42(orderedTree, x => x), 28))
test_sumTreeCPS42("root 42", () => assert.equal(sumTreeCPS42(leaf(42), x => x), 1000))

test_sumTreeCPS42("nested 42", () => assert.equal(
    sumTreeCPS42(tree(1,leaf(42), leaf(1)), x => x),
    1000))

test_sumTreeCPS42("double nested 42", () => assert.equal(
    sumTreeCPS42(
        tree(1,
            tree(1,
                leaf(1),
                leaf(42)
            ),
            leaf(1)), x => x),
    1000))

test_sumTreeCPS42.run();


const test_basicSums = suite("Tree sums properties");

const binaryTreeArbUnbiased = fc.letrec((tie) => ({
    binaryTree: fc.record({
        contents: fc.nat(),
        left: fc.option(tie("binaryTree"), { maxDepth: 8, depthIdentifier: "binaryTree"}),
        right: fc.option(tie("binaryTree"), { maxDepth: 8, depthIdentifier: "binaryTree"}),
    })
})).binaryTree as fc.Arbitrary<BinaryTree<number>>;

test_basicSums("Equality, unbiased", () => {
    fc.assert(
        fc.property(binaryTreeArbUnbiased, tree => {
            assert.equal(sumTreeRec42(tree), sumTreeIter42(tree));
            assert.equal(sumTreeRec42(tree), sumTreeCPS42(tree, x => x));
        }), { numRuns: 500 }
    )
})

const binaryTreeArb42 = fc.letrec((tie) => ({
    binaryTree: fc.record({
        contents: fc.oneof({ arbitrary: fc.nat(), weight: 10 }, { arbitrary: fc.constant(42), weight: 1}),
        left: fc.option(tie("binaryTree"), { maxDepth: 8, depthIdentifier: "binaryTree"}),
        right: fc.option(tie("binaryTree"), { maxDepth: 8, depthIdentifier: "binaryTree"}),
    })
})).binaryTree as fc.Arbitrary<BinaryTree<number>>;
test_basicSums("Equality, unbiased", () => {
    fc.assert(
        fc.property(binaryTreeArb42, tree => {
            assert.equal(sumTreeRec42(tree), sumTreeIter42(tree));
            assert.equal(sumTreeRec42(tree), sumTreeCPS42(tree, x => x));
        }), { numRuns: 500 }
    )
})

test_basicSums.run();

const test_properties = suite("properties");

test_properties.run();