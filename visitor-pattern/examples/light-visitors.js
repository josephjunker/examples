"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Node_left, _Node_right, _Leaf_value, _FillTree_value, _FillTree_depth;
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
// end-snippet
class Node {
    constructor(left, right) {
        _Node_left.set(this, void 0);
        _Node_right.set(this, void 0);
        __classPrivateFieldSet(this, _Node_left, left, "f");
        __classPrivateFieldSet(this, _Node_right, right, "f");
    }
    reduce(visitor) {
        return visitor.node(__classPrivateFieldGet(this, _Node_left, "f").reduce(visitor), __classPrivateFieldGet(this, _Node_right, "f").reduce(visitor));
    }
    match(visitor) {
        return visitor.node(__classPrivateFieldGet(this, _Node_left, "f"), __classPrivateFieldGet(this, _Node_right, "f"));
    }
}
_Node_left = new WeakMap(), _Node_right = new WeakMap();
class Leaf {
    constructor(value) {
        _Leaf_value.set(this, void 0);
        __classPrivateFieldSet(this, _Leaf_value, value, "f");
    }
    reduce(visitor) {
        return visitor.leaf(__classPrivateFieldGet(this, _Leaf_value, "f"));
    }
    match(visitor) {
        return visitor.leaf(__classPrivateFieldGet(this, _Leaf_value, "f"));
    }
}
_Leaf_value = new WeakMap();
const numTree = new Node(new Leaf(1), new Node(new Leaf(2), new Leaf(3)));
const strTree = new Node(new Leaf(""), new Leaf("asdf"));
// begin-snippet reduce-match
const sum = numTree.reduce({
    node: (x, y) => x + y,
    leaf: x => x
});
const isEmpty = strTree.match({
    node: function (left, right) { return left.match(this) || right.match(this); },
    leaf: x => x === ""
});
// end-snippet
assert_1.strict.equal(sum, 6);
assert_1.strict.equal(isEmpty, true);
const strTree2 = new Node(new Leaf("foo"), new Leaf("asdf"));
assert_1.strict.equal(strTree2.match({
    node: function (left, right) { return left.match(this) || right.match(this); },
    leaf: x => x === ""
}), false);
// begin-snippet fill-tree-naieve
function fillTree(value, depth) {
    return depth === 0 ?
        new Leaf(value) :
        new Node(fillTree(value, depth - 1), fillTree(value, depth - 1));
}
// end-snippet
function totalReduce(tree) {
    return tree.reduce({
        node: (left, right) => left + right,
        leaf: x => x
    });
}
function totalMatch(tree) {
    return tree.match({
        node: function (left, right) { return left.match(this) + right.match(this); },
        leaf: x => x
    });
}
assert_1.strict.equal(totalReduce(fillTree(1, 0)), 1);
assert_1.strict.equal(totalReduce(fillTree(1, 1)), 2);
assert_1.strict.equal(totalReduce(fillTree(1, 2)), 4);
assert_1.strict.equal(totalReduce(fillTree(1, 3)), 8);
assert_1.strict.equal(totalMatch(fillTree(1, 0)), 1);
assert_1.strict.equal(totalMatch(fillTree(1, 1)), 2);
assert_1.strict.equal(totalMatch(fillTree(1, 2)), 4);
assert_1.strict.equal(totalMatch(fillTree(1, 3)), 8);
function checkHasEmptyReduce(tree) {
    return tree.reduce({
        node: (left, right) => left || right,
        leaf: x => x === ""
    });
}
function checkHasEmptyMatch(tree) {
    return tree.match({
        node: function (left, right) { return left.match(this) || right.match(this); },
        leaf: x => x === ""
    });
}
assert_1.strict.equal(checkHasEmptyReduce(fillTree("", 1)), true);
assert_1.strict.equal(checkHasEmptyReduce(fillTree("", 2)), true);
assert_1.strict.equal(checkHasEmptyMatch(fillTree("a", 1)), false);
assert_1.strict.equal(checkHasEmptyMatch(fillTree("a", 2)), false);
// begin-snippet fill-tree-class
class FillTree {
    constructor(value, depth) {
        _FillTree_value.set(this, void 0);
        _FillTree_depth.set(this, void 0);
        __classPrivateFieldSet(this, _FillTree_value, value, "f");
        __classPrivateFieldSet(this, _FillTree_depth, depth, "f");
    }
    match(options) {
        if (__classPrivateFieldGet(this, _FillTree_depth, "f") === 0) {
            return options.leaf(__classPrivateFieldGet(this, _FillTree_value, "f"));
        }
        return options.node(new FillTree(__classPrivateFieldGet(this, _FillTree_value, "f"), __classPrivateFieldGet(this, _FillTree_depth, "f") - 1), new FillTree(__classPrivateFieldGet(this, _FillTree_value, "f"), __classPrivateFieldGet(this, _FillTree_depth, "f") - 1));
    }
    reduce(options) {
        const value = __classPrivateFieldGet(this, _FillTree_value, "f");
        function recursive(depth) {
            return depth === 0 ?
                options.leaf(value) :
                options.node(recursive(depth - 1), recursive(depth - 1));
        }
        return recursive(__classPrivateFieldGet(this, _FillTree_depth, "f"));
    }
}
_FillTree_value = new WeakMap(), _FillTree_depth = new WeakMap();
const anotherTree = new Node(new Leaf("foo"), new FillTree("bar", 3));
// end-snippet
console.log("foo");
assert_1.strict.equal(totalReduce(new FillTree(1, 1)), 2);
assert_1.strict.equal(totalReduce(new FillTree(1, 2)), 4);
assert_1.strict.equal(totalReduce(new FillTree(1, 3)), 8);
const x = new FillTree(1, 1);
const y = x.match({
    node: () => 1,
    leaf: () => 2
});
console.log(y);
assert_1.strict.equal(totalMatch(new FillTree(1, 0)), 1);
console.log("bar");
assert_1.strict.equal(totalMatch(new FillTree(1, 1)), 2);
console.log("baz");
assert_1.strict.equal(totalMatch(new FillTree(1, 2)), 4);
console.log("qux");
assert_1.strict.equal(totalMatch(new FillTree(1, 3)), 8);
assert_1.strict.equal(checkHasEmptyReduce(new FillTree("", 1)), true);
assert_1.strict.equal(checkHasEmptyReduce(new FillTree("", 2)), true);
assert_1.strict.equal(checkHasEmptyMatch(new FillTree("a", 1)), false);
assert_1.strict.equal(checkHasEmptyMatch(new FillTree("a", 2)), false);
