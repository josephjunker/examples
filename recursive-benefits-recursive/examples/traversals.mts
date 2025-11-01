import fc from "fast-check";

import { suite } from 'uvu';
import * as assert from 'uvu/assert';

// begin-snippet: list-helpers
type LinkedList<T> = {
    tag: "Cons",
    value: T,
    tail: LinkedList<T>
} | {
    tag: "Empty"
}

// Helper functions

function emptyList<T>(): LinkedList<T> {
    return { tag: "Empty" };
}

function concat<T>(head: T, tail: LinkedList<T>): LinkedList<T> {
    return {
        tag: "Cons",
        value: head,
        tail
    }
}
// end-snippet

type BinaryTree<T> = {
  contents: T,
  left: BinaryTree<T> | null,
  right: BinaryTree<T> | null
}

// begin-snippet: tree-helpers
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
// end-snippet

// begin-snippet: flattenTreePreRec
function flattenTreePreRec<T>(tree: BinaryTree<T>): LinkedList<T> {
    function recursive(tree: BinaryTree<T> | null, acc0: LinkedList<T>): LinkedList<T> {
        if (!tree) return acc0;
        const acc1 = concat(tree.contents, acc0);
        const acc2 = recursive(tree.left, acc1);
        return recursive(tree.right, acc2);
    }

    return recursive(tree, emptyList());
}
// end-snippet

// begin-snippet: flattenTreePostRec
function flattenTreePostRec<T>(tree: BinaryTree<T>): LinkedList<T> {
    function recursive(tree: BinaryTree<T> | null, acc0: LinkedList<T>): LinkedList<T> {
        if (!tree) return acc0;
        const acc1 = recursive(tree.right, acc0);
        const acc2 = recursive(tree.left, acc1);
        return concat(tree.contents, acc2);
    }

    return recursive(tree, emptyList());
}
// end-snippet

// begin-snippet: flattenTreePreIter
function flattenTreePreIter<T>(tree: BinaryTree<T>): LinkedList<T> {
    const stack: Array<BinaryTree<T>> = [tree];
    let flattened = emptyList<T>();

    while (stack.length) {
        const node = stack.pop()!;
        flattened = concat(node.contents, flattened)

        if (node.right) {
            stack.push(node.right);
        }

        if (node.left) {
            stack.push(node.left);
        }
    }

    return flattened;
}
// end-snippet

// begin-snippet: iterative-post-order
// Based off of https://stackoverflow.com/questions/1294701/post-order-traversal-of-binary-tree-without-recursion
function flattenTreePostIterSingle<T>(tree: BinaryTree<T>): LinkedList<T> {
    const stack: Array<BinaryTree<T>> = [tree];
    let flattened = emptyList<T>();

    let currentNode = tree;

    while (stack.length) {
        const next = stack[stack.length - 1];

        const finishedSubtrees = next.left === currentNode || next.right === currentNode;
        const isLeaf = !next.left && !next.right;

        if (finishedSubtrees || isLeaf) {
            currentNode = stack.pop()!;
            flattened = concat(currentNode.contents, flattened);
        } else {
            if (next.left) stack.push(next.left);
            if (next.right) stack.push(next.right);
        }
    }

    return flattened;
}

// Based off of https://maxnilz.com/docs/001-ds/tree/001-postorder-traversal/
function flattenTreePostIterDouble<T>(tree: BinaryTree<T>): LinkedList<T> {
    const stack1: Array<BinaryTree<T>> = [tree];
    const stack2: Array<BinaryTree<T>> = [];

    while(stack1.length) {
        const currentNode = stack1.pop()!;

        stack2.push(currentNode);
        if (currentNode.right) stack1.push(currentNode.right);
        if (currentNode.left) stack1.push(currentNode.left);
    }

    let result = emptyList<T>();
    while(stack2.length) {
        const currentNode = stack2.pop()!;
        result = concat(currentNode.contents, result)
    }

    return result;
}
// end-snippet

export function listToArray<T>(list: LinkedList<T>): Array<T> {
    const arr: Array<T> = [];
    let node = list;
    while(node.tag === "Cons") {
        arr.push(node.value);
        node = node.tail;
    }

    return arr;
}

const binaryTree = fc.letrec((tie) => ({
    binaryTree: fc.record({
        contents: fc.nat(),
        left: fc.option(tie("binaryTree"), { maxDepth: 8, depthIdentifier: "binaryTree"}),
        right: fc.option(tie("binaryTree"), { maxDepth: 8, depthIdentifier: "binaryTree"}),
    })
})).binaryTree as fc.Arbitrary<BinaryTree<number>>;

const test_traversals = suite("Traversals");

test_traversals("pre-order equalities", () => {
    fc.assert(
        fc.property(binaryTree, tree => {
            const preIterTree = flattenTreePreIter(tree);
            const preRecTree = flattenTreePreRec(tree);

            assert.equal(preIterTree, preRecTree);
        }), { numRuns: 500 });
});

test_traversals("post-order equalities", () => {
    fc.assert(
        fc.property(binaryTree, tree => {
            const postIterSingleTree = flattenTreePostIterSingle(tree);
            const postIterDoubleTree = flattenTreePostIterDouble(tree);
            const postRecTree = flattenTreePostRec(tree);

            assert.equal(postIterSingleTree, postIterDoubleTree);
            assert.equal(postIterDoubleTree, postRecTree);
        }), { numRuns: 500 });
});

test_traversals("reversal", () => {
    fc.assert(
        fc.property(binaryTree, tree => {
            const preRecTree = flattenTreePreRec(tree);
            const postRecTree = flattenTreePostRec(tree);

            assert.equal(listToArray(preRecTree), listToArray(postRecTree).reverse());
        }), { numRuns: 500 });
});

test_traversals.run();