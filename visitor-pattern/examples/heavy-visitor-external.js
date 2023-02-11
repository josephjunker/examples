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
var _Node_left, _Node_right, _Leaf_value;
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
class Node {
    constructor(left, right) {
        _Node_left.set(this, void 0);
        _Node_right.set(this, void 0);
        __classPrivateFieldSet(this, _Node_left, left, "f");
        __classPrivateFieldSet(this, _Node_right, right, "f");
    }
    acceptExternal(visitor) {
        return visitor.visitNode(__classPrivateFieldGet(this, _Node_left, "f"), __classPrivateFieldGet(this, _Node_right, "f"));
    }
}
_Node_left = new WeakMap(), _Node_right = new WeakMap();
class Leaf {
    constructor(value) {
        _Leaf_value.set(this, void 0);
        __classPrivateFieldSet(this, _Leaf_value, value, "f");
    }
    acceptExternal(visitor) {
        return visitor.visitLeaf(__classPrivateFieldGet(this, _Leaf_value, "f"));
    }
}
_Leaf_value = new WeakMap();
class DetectEmptyOptimized {
    visitNode(left, right) {
        return left.acceptExternal(this) || right.acceptExternal(this);
    }
    visitLeaf(value) {
        return value === "";
    }
}
const strTree = new Node(new Leaf(""), new Leaf("asdf"));
const hasEmpty = strTree.acceptExternal(new DetectEmptyOptimized());
// end-snippet
const strTree2 = new Node(new Leaf("foo"), new Leaf("asdf"));
assert_1.strict.equal(strTree.acceptExternal(new DetectEmptyOptimized()), true);
assert_1.strict.equal(strTree2.acceptExternal(new DetectEmptyOptimized()), false);
// Show that we never try to evaluate the second leaf if the first one is empty
// If we did try to evaluate it, this would throw due to a missing acceptExternal method
const strTree3 = new Node(new Leaf(""), undefined);
strTree3.acceptExternal(new DetectEmptyOptimized());
