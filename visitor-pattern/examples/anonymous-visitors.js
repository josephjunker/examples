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
    accept(visitor) {
        return visitor.visitNode(__classPrivateFieldGet(this, _Node_left, "f").accept(visitor), __classPrivateFieldGet(this, _Node_right, "f").accept(visitor));
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
    accept(visitor) {
        return visitor.visitLeaf(__classPrivateFieldGet(this, _Leaf_value, "f"));
    }
    acceptExternal(visitor) {
        return visitor.visitLeaf(__classPrivateFieldGet(this, _Leaf_value, "f"));
    }
}
_Leaf_value = new WeakMap();
const numTree = new Node(new Leaf(1), new Node(new Leaf(2), new Leaf(3)));
const strTree = new Node(new Leaf(""), new Leaf("asdf"));
// begin-snippet inline-objects
const sum = numTree.accept({
    visitNode: (x, y) => x + y,
    visitLeaf: x => x
});
const containsEmpty = strTree.acceptExternal({
    visitNode: function (left, right) { return left.acceptExternal(this) || right.acceptExternal(this); },
    visitLeaf: x => x === ""
});
// Alternatively, for those who prefer to avoid using `this`:
const detectEmpty = {
    visitNode: (left, right) => left.acceptExternal(detectEmpty) || right.acceptExternal(detectEmpty),
    visitLeaf: x => x === ""
};
const containsEmpty2 = strTree.acceptExternal(detectEmpty);
// end-snippet
assert_1.strict.equal(sum, 6);
assert_1.strict.equal(containsEmpty, true);
assert_1.strict.equal(containsEmpty2, true);
const strTree2 = new Node(new Leaf("foo"), new Leaf("asdf"));
const containsEmpty3 = strTree2.acceptExternal({
    visitNode: function (left, right) { return left.acceptExternal(this) || right.acceptExternal(this); },
    visitLeaf: x => x === ""
});
const containsEmpty4 = strTree2.acceptExternal(detectEmpty);
assert_1.strict.equal(containsEmpty3, false);
assert_1.strict.equal(containsEmpty4, false);
