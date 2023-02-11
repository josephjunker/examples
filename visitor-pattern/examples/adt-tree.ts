import { strict as assert } from "assert";

// begin-snippet: adt-tree-sum
type ADTTree<T> = ADTNode<T> | ADTLeaf<T>;
type ADTNode<T> = {
    tag: "ADTNode",
    left: ADTTree<T>,
    right: ADTTree<T>
}
type ADTLeaf<T> = {
    tag: "ADTLeaf",
    value: T
}

function sumTree(tree: ADTTree<number>): number {
    if (tree.tag === "ADTNode") {
        return sumTree(tree.left) + sumTree(tree.right);
    }

    return tree.value;
}
// end-snippet

function node<T>(left: ADTTree<T>, right: ADTTree<T>): ADTTree<T> {
    return {
        tag: "ADTNode",
	left,
	right
    };
}

function leaf<T>(value: T): ADTTree<T> {
    return {
	tag: "ADTLeaf",
	value
    };
}

assert.equal(sumTree(node(leaf(1), leaf(2))), 3);

export {}
