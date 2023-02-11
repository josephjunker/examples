import { strict as assert } from "assert";

// begin-snippet type-definitions
interface Tree<TContents> {
    // Previously "accept"
    reduce: <TResult>({ node, leaf }: TreeReduceArgs<TContents, TResult>) => TResult

    // Previously "acceptExternal"
    match: <TResult>({ node, leaf }: TreeMatchArgs<TContents, TResult>) => TResult,
}

interface TreeReduceArgs<TContents, TResult> {
    node: (left: TResult, right: TResult) => TResult,
    leaf: (value: TContents) => TResult
}

interface TreeMatchArgs<TContents, TResult> {
    node: (left: Tree<TContents>, right: Tree<TContents>) => TResult,
    leaf: (value: TContents) => TResult
}
// end-snippet


class Node<T> implements Tree<T> {
    #left: Tree<T>;
    #right: Tree<T>;
    public constructor(left: Tree<T>, right: Tree<T>) {
        this.#left = left;
        this.#right = right;
    }

    public reduce<S>(visitor: TreeReduceArgs<T, S>): S {
        return visitor.node(
            this.#left.reduce(visitor),
            this.#right.reduce(visitor));
    }

    public match<S>(visitor: TreeMatchArgs<T, S>): S {
        return visitor.node(this.#left, this.#right);
    }
}

class Leaf<T> implements Tree<T> {
    #value: T;
    public constructor(value: T) {
        this.#value = value;
    }

    public reduce<S>(visitor: TreeReduceArgs<T, S>): S {
        return visitor.leaf(this.#value);
    }

    public match<S>(visitor: TreeMatchArgs<T, S>): S {
        return visitor.leaf(this.#value);
    }
}

const numTree = new Node(
    new Leaf(1),
    new Node(
        new Leaf(2),
    new Leaf(3)));

const strTree = new Node(
   new Leaf(""),
   new Leaf("asdf"));

// begin-snippet reduce-match
const sum = numTree.reduce<number>({
    node: (x, y) => x + y,
    leaf: x => x
});

const isEmpty = strTree.match<boolean>({
    node: function(left, right) { return left.match(this) || right.match(this); },
    leaf: x => x === ""
});
// end-snippet

assert.equal(sum, 6);
assert.equal(isEmpty, true);

const strTree2 = new Node(
   new Leaf("foo"),
   new Leaf("asdf"));

assert.equal(strTree2.match<boolean>({
    node: function(left, right) { return left.match(this) || right.match(this) },
    leaf: x => x === ""
}), false);

// begin-snippet fill-tree-naieve
function fillTree<T>(value: T, depth: number): Tree<T> {
    return depth === 0 ?
        new Leaf(value) :
        new Node(
            fillTree(value, depth - 1),
            fillTree(value, depth - 1));
}
// end-snippet

function totalReduce(tree: Tree<number>): number {
    return tree.reduce({
        node: (left, right) => left + right,
        leaf: x => x
    });
}

function totalMatch(tree: Tree<number>): number {
    return tree.match<number>({
        node: function(left, right) { return left.match(this) + right.match(this); },
        leaf: x => x
    });
}

assert.equal(totalReduce(fillTree(1, 0)), 1);
assert.equal(totalReduce(fillTree(1, 1)), 2);
assert.equal(totalReduce(fillTree(1, 2)), 4);
assert.equal(totalReduce(fillTree(1, 3)), 8);

assert.equal(totalMatch(fillTree(1, 0)), 1);
assert.equal(totalMatch(fillTree(1, 1)), 2);
assert.equal(totalMatch(fillTree(1, 2)), 4);
assert.equal(totalMatch(fillTree(1, 3)), 8);

function checkHasEmptyReduce(tree: Tree<string>): boolean {
    return tree.reduce({
        node: (left, right) => left || right,
        leaf: x => x === ""
    });
}

function checkHasEmptyMatch(tree: Tree<string>): boolean {
    return tree.match<boolean>({
        node: function (left, right) { return left.match(this) || right.match(this); },
        leaf: x => x === ""
    });
}

assert.equal(checkHasEmptyReduce(fillTree("", 1)), true);
assert.equal(checkHasEmptyReduce(fillTree("", 2)), true);
assert.equal(checkHasEmptyMatch(fillTree("a", 1)), false);
assert.equal(checkHasEmptyMatch(fillTree("a", 2)), false);

// begin-snippet fill-tree-class
class FillTree<TContents> implements Tree<TContents> {
    readonly #value: TContents;
    readonly #depth: number;

    constructor(value: TContents, depth: number) {
        this.#value = value;
        this.#depth = depth;
    }

    public match<TResult>(options: TreeMatchArgs<TContents, TResult>): TResult {
        if (this.#depth === 0) {
            return options.leaf(this.#value);
        }

        return options.node(
            new FillTree(this.#value, this.#depth - 1),
            new FillTree(this.#value, this.#depth - 1))
    }

    public reduce<TResult>(options: TreeReduceArgs<TContents, TResult>): TResult {
        const value = this.#value;

        function recursive(depth: number): TResult {
            return depth === 0 ?
                options.leaf(value) :
                options.node(recursive(depth - 1), recursive(depth - 1));
        }

        return recursive(this.#depth);
    }
}

const anotherTree = new Node(
    new Leaf("foo"),
    new FillTree("bar", 3));
// end-snippet

assert.equal(totalReduce(new FillTree(1, 1)), 2);
assert.equal(totalReduce(new FillTree(1, 2)), 4);
assert.equal(totalReduce(new FillTree(1, 3)), 8);

assert.equal(totalMatch(new FillTree(1, 0)), 1);
assert.equal(totalMatch(new FillTree(1, 1)), 2);
assert.equal(totalMatch(new FillTree(1, 2)), 4);
assert.equal(totalMatch(new FillTree(1, 3)), 8);

assert.equal(checkHasEmptyReduce(new FillTree("", 1)), true);
assert.equal(checkHasEmptyReduce(new FillTree("", 2)), true);
assert.equal(checkHasEmptyMatch(new FillTree("a", 1)), false);
assert.equal(checkHasEmptyMatch(new FillTree("a", 2)), false);

export {}