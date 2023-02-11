"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
function sumTree(tree) {
    if (tree.tag === "ADTNode") {
        return sumTree(tree.left) + sumTree(tree.right);
    }
    return tree.value;
}
// end-snippet
function node(left, right) {
    return {
        tag: "ADTNode",
        left,
        right
    };
}
function leaf(value) {
    return {
        tag: "ADTLeaf",
        value
    };
}
assert_1.strict.equal(sumTree(node(leaf(1), leaf(2))), 3);
