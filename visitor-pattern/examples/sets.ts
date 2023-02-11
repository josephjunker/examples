import { strict as assert } from "assert";

// begin-snippet: number-set
interface NumberSet {
    has(n: number): boolean;
    union(s: NumberSet): NumberSet;
}
// end-snippet

// begin-snippet: array-and-union-sets
class ArraySet implements NumberSet {
    #arr: number[];
    public constructor(arr: number[]) {
        this.#arr = arr;
    }

    public has(n: number): boolean {
        return this.#arr.includes(n);
    }

    public union(s: NumberSet): NumberSet {
        return new SetUnion(this, s);
    }
}

class SetUnion implements NumberSet {
    #left: NumberSet;
    #right: NumberSet;

    public constructor(left: NumberSet, right: NumberSet) {
        this.#left = left;
        this.#right = right;
    }

    public has(n: number) {
        return this.#left.has(n) || this.#right.has(n);
    }

    public union(s: NumberSet): NumberSet {
        return new SetUnion(this, s);
    }
}
// end-snippet

// begin-snippet: odd-set
class Odd implements NumberSet {
    public constructor() {}

    public has(n: number): boolean {
        return n % 2 !== 0;
    }

    public union(s: NumberSet): NumberSet {
        return new SetUnion(this, s);
    }
}
// end-snippet

const arrSet = new ArraySet([3, 4, 5]);
assert.equal(arrSet.has(3), true);
assert.equal(arrSet.has(6), false);

const unionSet = new SetUnion(arrSet, new Odd());
assert.equal(unionSet.has(5), true);
assert.equal(unionSet.has(7), true);
assert.equal(unionSet.has(8), false);

const odd = new Odd();
assert.equal(odd.has(1), true)
assert.equal(odd.has(2), false)

export {}