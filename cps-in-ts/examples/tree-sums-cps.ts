import fc from "fast-check";

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

// begin-snippet: binary-tree-typedef
type BinaryTree<T> = {
  contents: T,
  left: BinaryTree<T> | null,
  right: BinaryTree<T> | null
}
// end-snippet

// begin-snippet: sumTree
function sumTree(tree: BinaryTree<number> | null): number {
    if (!tree) return 0;
    return sumTree(tree.left) + sumTree(tree.right) + tree.contents;
}
// end-snippet

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

const test_sumTree = suite("sumTree")

test_sumTree("null", () => assert.equal(sumTree(null), 0))
test_sumTree("1", () => assert.equal(sumTree(leaf(1)), 1))
test_sumTree("nested", () => assert.equal(sumTree(orderedTree), 28))

test_sumTree.run();


// begin-snippet: sumTreeIterative
function sumTreeIterative(tree: BinaryTree<number>): number {
    const stack: Array<BinaryTree<number>> = [tree];
    let total = 0;

    while (stack.length) {
        const node = stack.pop()!;
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

const test_sumTreeIterative = suite("sumTreeIterative");

test_sumTreeIterative("1", () => assert.equal(sumTreeIterative(leaf(1)), 1));
test_sumTreeIterative("nested", () => assert.equal(sumTreeIterative(orderedTree), 28));

test_sumTreeIterative.run();

// begin-snippet: sumTreeCPS
function sumTreeCPS<K>(tree: BinaryTree<number> | null, k: (n: number) => K): K {
    if (!tree) return k(0);
    
    return sumTreeCPS(tree.left, (leftSum) =>
        sumTreeCPS(tree.right, (rightSum) =>
            k(leftSum + tree.contents + rightSum)));
}
// end-snippet

const test_sumTreeCPS = suite("sumTreeCPS");

test_sumTreeCPS("null", () => assert.equal(sumTreeCPS(null, x => x), 0));
test_sumTreeCPS("1", () => assert.equal(sumTreeCPS(leaf(1), x => x), 1));
test_sumTreeCPS("nested", () => assert.equal(sumTreeCPS(orderedTree, x => x), 28));

test_sumTreeCPS.run();

const someTree = null;

// begin-snippet: sumTreeCPS-usage
const sum = sumTreeCPS(someTree, x => x); // sum has type `number`
// end-snippet

const binaryTreeArb = fc.letrec((tie) => ({
    binaryTree: fc.record({
        contents: fc.nat(),
        left: fc.option(tie("binaryTree"), { maxDepth: 8, depthIdentifier: "binaryTree"}),
        right: fc.option(tie("binaryTree"), { maxDepth: 8, depthIdentifier: "binaryTree"}),
    })
})).binaryTree as fc.Arbitrary<BinaryTree<number>>;

const test_basicSums = suite("Tree sums properties");

test_basicSums("Equality", () => {
    fc.assert(
        fc.property(binaryTreeArb, tree => {
            assert.equal(sumTree(tree), sumTreeIterative(tree));
            assert.equal(sumTree(tree), sumTreeCPS(tree, x => x));
        }), { numRuns: 500 }
    )
})

test_basicSums.run();