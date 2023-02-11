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
var _ArraySet_arr, _SetUnion_left, _SetUnion_right;
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
// end-snippet
// begin-snippet: array-and-union-sets
class ArraySet {
    constructor(arr) {
        _ArraySet_arr.set(this, void 0);
        __classPrivateFieldSet(this, _ArraySet_arr, arr, "f");
    }
    has(n) {
        return __classPrivateFieldGet(this, _ArraySet_arr, "f").includes(n);
    }
    union(s) {
        return new SetUnion(this, s);
    }
}
_ArraySet_arr = new WeakMap();
class SetUnion {
    constructor(left, right) {
        _SetUnion_left.set(this, void 0);
        _SetUnion_right.set(this, void 0);
        __classPrivateFieldSet(this, _SetUnion_left, left, "f");
        __classPrivateFieldSet(this, _SetUnion_right, right, "f");
    }
    has(n) {
        return __classPrivateFieldGet(this, _SetUnion_left, "f").has(n) || __classPrivateFieldGet(this, _SetUnion_right, "f").has(n);
    }
    union(s) {
        return new SetUnion(this, s);
    }
}
_SetUnion_left = new WeakMap(), _SetUnion_right = new WeakMap();
// end-snippet
// begin-snippet: odd-set
class Odd {
    constructor() { }
    has(n) {
        return n % 2 !== 0;
    }
    union(s) {
        return new SetUnion(this, s);
    }
}
// end-snippet
const arrSet = new ArraySet([3, 4, 5]);
assert_1.strict.equal(arrSet.has(3), true);
assert_1.strict.equal(arrSet.has(6), false);
const unionSet = new SetUnion(arrSet, new Odd());
assert_1.strict.equal(unionSet.has(5), true);
assert_1.strict.equal(unionSet.has(7), true);
assert_1.strict.equal(unionSet.has(8), false);
const odd = new Odd();
assert_1.strict.equal(odd.has(1), true);
assert_1.strict.equal(odd.has(2), false);
