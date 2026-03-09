import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as fc from 'fast-check';

// begin-snippet: tree-definition
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

const exampleTree = tree(
    1,
    tree(2, leaf(3), leaf(4)),
    tree(5, leaf(6), leaf(7))
)
// end-snippet

// begin-snippet: sum-tree
function sumTree(tree: BinaryTree<number> | null): number {
    if (!tree) return 0;
    const leftSum = sumTree(tree.left);
    const rightSum = sumTree(tree.right);
    return leftSum + rightSum + tree.contents;
}
// end-snippet

// begin-snippet: sum-tree-iterative
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

const treeArb = fc.letrec(tie => ({
    leaf: fc.record({
        contents: fc.nat(),
        left: fc.constant(null),
        right: fc.constant(null),
    }),
    tree: fc.record({
        contents: fc.nat(),
        left: fc.oneof({ depthSize: "medium" }, tie("leaf"), tie("tree")),
        right: fc.oneof({ depthSize: "medium" }, tie("leaf"), tie("tree")),
    })
})).tree as fc.Arbitrary<BinaryTree<number>>;

test("tree function equality", () => {
    fc.assert(
        fc.property(treeArb, t => assert.equal(sumTree(t), sumTreeIterative(t)))
    )
});

test.run();