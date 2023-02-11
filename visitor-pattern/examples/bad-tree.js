"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Node_left, _Node_right, _Leaf_value;
Object.defineProperty(exports, "__esModule", { value: true });
;
class Node {
    constructor(left, right) {
        _Node_left.set(this, void 0);
        _Node_right.set(this, void 0);
        __classPrivateFieldSet(this, _Node_left, left, "f");
        __classPrivateFieldSet(this, _Node_right, right, "f");
    }
}
_Node_left = new WeakMap(), _Node_right = new WeakMap();
class Leaf {
    constructor(value) {
        _Leaf_value.set(this, void 0);
        __classPrivateFieldSet(this, _Leaf_value, value, "f");
    }
}
_Leaf_value = new WeakMap();
